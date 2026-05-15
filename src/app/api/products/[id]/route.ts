import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse, Product } from '@/types';

/**
 * GET /api/products/[id]
 * Retrieve a single product by ID for the authenticated user
 *
 * Parameters:
 * - id: Product ID (UUID)
 *
 * Returns: { success: true, data: Product }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
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

    // Get product ID from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch the product
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product as Product,
    });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[id]
 * Update a single product for the authenticated user
 *
 * Parameters:
 * - id: Product ID (UUID)
 *
 * Request Body (all fields optional):
 * - name: string
 * - sku: string
 * - category: string
 * - price: number
 * - unit: string
 * - description: string
 *
 * Returns: { success: true, data: Product }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
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

    // Get product ID from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, sku, category, price, unit, description } = body;

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid field type: name must be a string' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (sku !== undefined) {
      if (typeof sku !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid field type: sku must be a string' },
          { status: 400 }
        );
      }
      updateData.sku = sku.toUpperCase().trim();
    }

    if (category !== undefined) {
      if (category !== null && typeof category !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid field type: category must be a string or null' },
          { status: 400 }
        );
      }
      updateData.category = category ? category.trim() : null;
    }

    if (price !== undefined) {
      if (price !== null && typeof price !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Invalid field type: price must be a number or null' },
          { status: 400 }
        );
      }
      updateData.price = price ? parseFloat(price) : null;
    }

    if (unit !== undefined) {
      if (unit !== null && typeof unit !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid field type: unit must be a string or null' },
          { status: 400 }
        );
      }
      updateData.unit = unit ? unit.trim() : null;
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid field type: description must be a string or null' },
          { status: 400 }
        );
      }
      updateData.description = description ? description.trim() : null;
    }

    // If no fields provided to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields provided to update' },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to user
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error checking product:', checkError);
      return NextResponse.json(
        { success: false, error: 'Failed to update product' },
        { status: 500 }
      );
    }

    // Check if new SKU conflicts with another product (if SKU is being updated)
    if (sku !== undefined) {
      const { data: conflictingSku, error: skuCheckError } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', user.id)
        .eq('sku', (updateData.sku as string).toUpperCase())
        .neq('id', id)
        .single();

      if (skuCheckError && skuCheckError.code !== 'PGRST116') {
        console.error('Error checking SKU conflict:', skuCheckError);
        return NextResponse.json(
          { success: false, error: 'Failed to validate SKU' },
          { status: 500 }
        );
      }

      if (conflictingSku) {
        return NextResponse.json(
          { success: false, error: 'SKU already exists for another product' },
          { status: 409 }
        );
      }
    }

    // Update the product
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct as Product,
    });
  } catch (error) {
    console.error('PATCH /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Soft delete a product for the authenticated user (sets is_active = false)
 *
 * Parameters:
 * - id: Product ID (UUID)
 *
 * Returns: { success: true }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
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

    // Get product ID from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to user
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error checking product:', checkError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    // Soft delete: set is_active = false
    const { error: deleteError } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
