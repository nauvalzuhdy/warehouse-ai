import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse, Product } from '@/types';

/**
 * GET /api/products
 * Retrieve products for the authenticated user with optional filtering
 *
 * Query Parameters:
 * - search: Filter by product name or SKU (partial match)
 * - category: Filter by product category (exact match)
 * - limit: Maximum number of results (default: 50)
 *
 * Returns: { success: true, data: Product[], count: number }
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ data: Product[]; count: number }>>> {
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
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 1000);

    // Build the base query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category);
    }

    // Execute query
    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products' },
        { status: 500 }
      );
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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product for the authenticated user
 *
 * Request Body:
 * - name: string (required) - Product name
 * - sku: string (required) - Stock Keeping Unit
 * - category: string (optional) - Product category
 * - price: number (optional) - Product price
 * - unit: string (optional) - Unit of measurement
 * - description: string (optional) - Product description
 *
 * Returns: { success: true, data: Product }
 * Errors:
 * - 400: Validation failed (missing required fields)
 * - 409: SKU already exists for this user
 * - 401: Unauthorized
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Product>>> {
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

    // Parse request body
    const body = await request.json();
    const { name, sku, category, price, unit, description } = body;

    // Validate required fields
    if (!name || !sku) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name and sku are required' },
        { status: 400 }
      );
    }

    // Validate that name and sku are strings
    if (typeof name !== 'string' || typeof sku !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid field types: name and sku must be strings' },
        { status: 400 }
      );
    }

    // Check if SKU already exists for this user
    const { data: existingSku, error: skuCheckError } = await supabase
      .from('products')
      .select('id')
      .eq('user_id', user.id)
      .eq('sku', sku.toUpperCase())
      .single();

    if (skuCheckError && skuCheckError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is expected
      console.error('Error checking SKU:', skuCheckError);
      return NextResponse.json(
        { success: false, error: 'Failed to validate SKU' },
        { status: 500 }
      );
    }

    if (existingSku) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists for this user' },
        { status: 409 }
      );
    }

    // Insert new product
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

    if (insertError) {
      console.error('Error creating product:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newProduct as Product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
