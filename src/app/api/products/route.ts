import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse, Product } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ data: Product[]; count: number }>>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 1000);

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        data: (data as Product[]) || [],
        count: count || 0,
      },
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, sku, category, price, unit, description } = body;

    if (!name || !sku) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name and sku are required' },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || typeof sku !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid field types: name and sku must be strings' },
        { status: 400 }
      );
    }

    const { data: existingSku, error: skuCheckError } = await supabase
      .from('products')
      .select('id')
      .eq('user_id', user.id)
      .eq('sku', sku.toUpperCase())
      .single();

    if (skuCheckError && skuCheckError.code !== 'PGRST116') {
      console.error('Error checking SKU:', skuCheckError);
      return NextResponse.json({ success: false, error: 'Failed to validate SKU' }, { status: 500 });
    }

    if (existingSku) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists for this user' },
        { status: 409 }
      );
    }

    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        name: name.trim(),
        sku: sku.toUpperCase().trim(),
        category: category ? category.trim() : null,
        price: price ? parseFloat(price) : null,
        unit: unit ? unit.trim() : null,
        description: description ? description.trim() : null,
        is_active: true,
      })
      .select()
      .single();

    if (insertError || !newProduct) {
      console.error('Error creating product:', insertError);
      return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
    }

    const { data: warehouses, error: warehousesError } = await supabase
      .from('warehouses')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (warehousesError) {
      console.error('Error fetching warehouses:', warehousesError);
    } else if (warehouses && warehouses.length > 0) {
      const stockRecords = warehouses.map((warehouse: { id: string }) => ({
        product_id: newProduct.id,
        warehouse_id: warehouse.id,
        quantity: 0,
      }));

      const { error: stockError } = await supabase
        .from('stock')
        .upsert(stockRecords, { onConflict: 'product_id,warehouse_id' });

      if (stockError) {
        console.error('Error creating stock entries:', JSON.stringify(stockError, null, 2));
      }
    }

    return NextResponse.json(
      { success: true, data: newProduct as Product },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}