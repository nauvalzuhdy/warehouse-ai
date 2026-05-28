import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse, Product } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      console.error('Error fetching product:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: product as Product });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, sku, category, price, unit, description } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json({ success: false, error: 'Invalid field type: name must be a string' }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (sku !== undefined) {
      if (typeof sku !== 'string') {
        return NextResponse.json({ success: false, error: 'Invalid field type: sku must be a string' }, { status: 400 });
      }
      updateData.sku = sku.toUpperCase().trim();
    }

    if (category !== undefined) {
      updateData.category = category ? category.trim() : null;
    }

    if (price !== undefined) {
      updateData.price = price ? parseFloat(price) : null;
    }

    if (unit !== undefined) {
      updateData.unit = unit ? unit.trim() : null;
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields provided to update' }, { status: 400 });
    }

    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }

    if (sku !== undefined) {
      const { data: conflictingSku } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', user.id)
        .eq('sku', (updateData.sku as string).toUpperCase())
        .neq('id', id)
        .single();

      if (conflictingSku) {
        return NextResponse.json({ success: false, error: 'SKU already exists for another product' }, { status: 409 });
      }
    }

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedProduct as Product });
  } catch (error) {
    console.error('PATCH /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }

    const { error: deleteError } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}