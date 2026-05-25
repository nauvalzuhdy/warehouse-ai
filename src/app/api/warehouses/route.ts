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

/**
 * GET /api/warehouses
 * Retrieve all warehouses for the authenticated user with stock utilization
 */
export async function GET(): Promise<NextResponse<ApiResponse<WarehouseWithUtilization[]>>> {
  try {
    const supabase = await createClient();

    // Get authenticated user
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

    // Query warehouses for the authenticated user where is_active = true
    const { data: warehouses, error: warehouseError } = await supabase
      .from('warehouses')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (warehouseError) {
      console.error('Error fetching warehouses:', warehouseError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch warehouses' },
        { status: 500 }
      );
    }

    // Calculate stock utilization for each warehouse
    const warehousesWithUtilization: WarehouseWithUtilization[] = await Promise.all(
      (warehouses || []).map(async (warehouse) => {
        // Query total stock for this warehouse
        const { data: stockData, error: stockError } = await supabase
          .from('stock')
          .select('quantity')
          .eq('warehouse_id', warehouse.id);

        if (stockError) {
          console.error(`Error fetching stock for warehouse ${warehouse.id}:`, stockError);
          return {
            ...warehouse,
            total_stock: 0,
            utilization_percent: 0,
          };
        }

        // Sum quantities
        const total_stock = (stockData || []).reduce(
          (sum, stock) => sum + (stock.quantity || 0),
          0
        );

        // Calculate utilization percentage
        const utilization_percent = warehouse.max_capacity > 0
          ? Math.min((total_stock / warehouse.max_capacity) * 100, 100)
          : 0;

        return {
          ...warehouse,
          total_stock,
          utilization_percent,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: warehousesWithUtilization,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/warehouses:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/warehouses
 * Create a new warehouse for the authenticated user
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Warehouse>>> {
  try {
    const supabase = await createClient();

    // Get authenticated user
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

    // Parse request body
    const body = await request.json();
    const { name, location, capacity, description } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // ✅ FIX: Parse capacity to number first (JSON may send string or float)
    const parsedCapacity = Math.floor(Number(capacity));

    if (!capacity || isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Capacity must be a positive integer' },
        { status: 400 }
      );
    }

    // Insert warehouse
    const { data: warehouse, error: insertError } = await supabase
      .from('warehouses')
      .insert({
        user_id: user.id,
        name: name.trim(),
        location: location || null,
        max_capacity: parsedCapacity, // ✅ pakai parsedCapacity
        description: description || null,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating warehouse:', insertError);
      console.error('Insert error details:', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { success: false, error: 'Failed to create warehouse' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: warehouse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/warehouses:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}