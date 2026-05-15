import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductsTable } from '@/components/products';

/**
 * Products list page
 * Displays all products for the authenticated user
 */
export default async function ProductsPage() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User auth error:', userError);
      return (
        <PageContainer>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Unauthorized</p>
          </div>
        </PageContainer>
      );
    }

    console.log('=== ProductsPage Debug ===');
    console.log('User ID:', user.id);

    // First, fetch ALL products to see what we have
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    console.log('All products (no filter):', allProducts?.length, allProducts);
    console.log('All products error:', allError);

    // Then fetch active products
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50);

    console.log('Active products:', products?.length, products);
    console.log('Active products error:', error);

    if (error) {
      console.error('Error fetching products:', error);
      return (
        <PageContainer>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">
                Gagal memuat data produk
              </p>
              <p className="text-xs text-red-500 mt-2">
                {error.message || JSON.stringify(error)}
              </p>
            </div>
          </div>
        </PageContainer>
      );
    }

    const productList = (products || []) as Product[];

    console.log('ProductsPage - Final productList:', productList.length, productList);
    console.log('=== End Debug ===');

    // Calculate stats
    const totalProducts = productList.length;
    const uniqueCategories = new Set(
      productList
        .filter((p) => p.category)
        .map((p) => p.category)
    ).size;

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Produk"
        description="Kelola semua produk yang ada di warehouse kamu."
        action={
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Link>
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="font-semibold">{totalProducts}</span>
          <span className="text-sm text-muted-foreground">produk</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50">
          <span className="text-sm text-muted-foreground">Aktif:</span>
          <span className="font-semibold">{totalProducts}</span>
          <span className="text-sm text-muted-foreground">produk</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50">
          <span className="text-sm text-muted-foreground">Kategori:</span>
          <span className="font-semibold">{uniqueCategories}</span>
          <span className="text-sm text-muted-foreground">kategori</span>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable initialProducts={productList} />
    </PageContainer>
  );
  } catch (err) {
    console.error('ProductsPage error:', err);
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              Terjadi kesalahan saat memuat halaman
            </p>
            <p className="text-xs text-red-500 mt-2">
              {err instanceof Error ? err.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }
}

