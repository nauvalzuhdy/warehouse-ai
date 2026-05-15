import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DEBUG ONLY: Endpoint to diagnose product fetching issues
 * Shows raw data from database without filters
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({
        error: 'Not authenticated',
        userError,
      }, { status: 401 });
    }

    // Get ALL products for this user (no filters)
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    // Get ONLY active products
    const { data: activeProducts, error: activeError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    return NextResponse.json({
      user_id: user.id,
      user_email: user.email,
      all_products_count: allProducts?.length || 0,
      all_products_error: allError,
      all_products: allProducts,
      active_products_count: activeProducts?.length || 0,
      active_products_error: activeError,
      active_products: activeProducts,
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
