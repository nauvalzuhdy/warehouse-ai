import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse, StockWithDetails } from '@/types';

/**
 * GET /api/stock
 * Retrieve stock information with product and warehouse details
 *
 * Query Parameters:
 * - warehouse_id: Filter by specific warehouse (optional)
 * - product_id: Filter by specific product (optional)
 *
 * Returns: { success: true, data: StockWithDetails[] }
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<StockWithDetails[]>>> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const warehouseId = searchParams.get('warehouse_id') || undefined;
    const productId = searchParams.get('product_id') || undefined;

    // Get all warehouse IDs owned by this user (for security filtering)
    const { data: userWarehouses, error: warehouseError } = await supabase
      .from('warehouses')
      .select('id')
      .eq('user_id', user.id);

    if (warehouseError) {
      console.error('Error fetching user warehouses:', warehouseError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch warehouses' },
        { status: 500 }
      );
    }

    const warehouseIds = userWarehouses?.map((w) => w.id) || [];

    // If user has no warehouses, return empty array
    if (warehouseIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Build the base query with joins
    // Filter by user's warehouse IDs to ensure ownership (stock has no user_id column)
    let query = supabase
      .from('stock')
      .select(`
        *,
        product:products(*),
        warehouse:warehouses(*)
      `)
      .in('warehouse_id', warehouseIds)
      .order('updated_at', { ascending: false });

    // Apply warehouse_id filter if provided (must still be within user's warehouses)
    if (warehouseId) {
      query = query.eq('warehouse_id', warehouseId);
    }

    // Apply product_id filter if provided
    if (productId) {
      query = query.eq('product_id', productId);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stock:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch stock' },
        { status: 500 }
      );
    }

    // Filter for active products and warehouses only
    const filteredData = (data || []).filter(
      (item: any) => item.product?.is_active && item.warehouse?.is_active
    ) as StockWithDetails[];

    return NextResponse.json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error('GET /api/stock error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ message: 'POST /api/stock' });
}