import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse, Stock } from '@/types';

interface StockHistory {
  id: string;
  product_id: string;
  warehouse_id: string;
  user_id: string;
  quantity_change: number;
  quantity_after: number;
  transaction_type: 'in' | 'out' | 'adjustment';
  notes: string | null;
  created_at: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ stock: Stock; history_entry: StockHistory }>>> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Stock ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity_change, type, notes } = body;

    if (typeof quantity_change !== 'number' || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: quantity_change and type are required' },
        { status: 400 }
      );
    }

    if (!['in', 'out', 'adjustment'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be one of: in, out, adjustment' },
        { status: 400 }
      );
    }

    if (Math.abs(quantity_change) > 1_000_000) {
      return NextResponse.json(
        { success: false, error: 'quantity_change melebihi batas maksimum' },
        { status: 400 }
      );
    }

    const { data: currentStock, error: fetchError } = await supabase
      .from('stock')
      .select('*, warehouse:warehouses(user_id)')
      .eq('id', id)
      .single();

    if (fetchError || !currentStock) {
      return NextResponse.json(
        { success: false, error: 'Stock record not found' },
        { status: 404 }
      );
    }

    if (currentStock.warehouse?.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const newQuantity = currentStock.quantity + quantity_change;

    if (newQuantity < 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Stok tidak cukup. Stok saat ini: ${currentStock.quantity} unit.`,
        },
        { status: 400 }
      );
    }

    const { data: updatedStock, error: updateError } = await supabase
      .from('stock')
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedStock) {
      console.error('Error updating stock:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update stock' },
        { status: 500 }
      );
    }

    const { data: historyEntry, error: historyError } = await supabase
      .from('stock_history')
      .insert({
        product_id: currentStock.product_id,
        warehouse_id: currentStock.warehouse_id,
        user_id: user.id,
        quantity_change,
        quantity_after: newQuantity,
        transaction_type: type,
        notes: notes || null,
      })
      .select()
      .single();

    if (historyError) {
      console.error('Error creating stock history:', JSON.stringify(historyError, null, 2));
      return NextResponse.json(
        { success: false, error: `Failed to save history: ${historyError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          stock: updatedStock as Stock,
          history_entry: historyEntry as StockHistory,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/stock/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}