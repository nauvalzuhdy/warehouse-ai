import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, Warehouse } from '@/types';

/**
 * Warehouse with calculated utilization metrics
 */
interface WarehouseWithUtilization extends Warehouse {
  total_stock: number;
  utilization_percent: number;
}

type Params = Promise<{ id: string }>;

/**
 * GET /api/warehouses/[id]
 * Retrieve a single warehouse by ID with stock utilization
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse<ApiResponse<WarehouseWithUtilization>>> {
  try {
    const { id } = await params; // ✅ await params
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: warehouse, error: warehouseError } = await supabase
      .from('warehouses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (warehouseError || !warehouse) {
      return NextResponse.json(
        { success: false, error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    const { data: stockData, error: stockError } = await supabase
      .from('stock')
      .select('quantity')
      .eq('warehouse_id', warehouse.id);

    if (stockError) {
      console.error(`Error fetching stock for warehouse ${warehouse.id}:`, stockError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch warehouse utilization' },
        { status: 500 }
      );
    }

    const total_stock = (stockData || []).reduce(
      (sum, stock) => sum + (stock.quantity || 0),
      0
    );

    const utilization_percent = warehouse.max_capacity > 0
      ? Math.min((total_stock / warehouse.max_capacity) * 100, 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...warehouse,
        total_stock,
        utilization_percent,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/warehouses/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/warehouses/[id]
 * Update a warehouse
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse<ApiResponse<Warehouse>>> {
  try {
    const { id } = await params; // ✅ await params
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Normalize capacity if present
    if (body.capacity !== undefined) {
      body.max_capacity = Math.floor(Number(body.capacity));
      delete body.capacity;
    }

    const { data: warehouse, error: updateError } = await supabase
      .from('warehouses')
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError || !warehouse) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/warehouses/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/warehouses/[id]
 * Soft delete a warehouse (only if no active stock)
 */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params; // ✅ await params
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: warehouse, error: warehouseError } = await supabase
      .from('warehouses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (warehouseError || !warehouse) {
      return NextResponse.json(
        { success: false, error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    const { data: activeStock, error: stockError } = await supabase
      .from('stock')
      .select('id')
      .eq('warehouse_id', id)
      .gt('quantity', 0);

    if (stockError) {
      console.error(`Error checking stock for warehouse ${id}:`, stockError);
      return NextResponse.json(
        { success: false, error: 'Failed to check warehouse stock' },
        { status: 500 }
      );
    }

    if (activeStock && activeStock.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gudang masih memiliki stok aktif. Kosongkan stok sebelum menghapus gudang.',
        },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from('warehouses')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting warehouse:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete warehouse' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/warehouses/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}