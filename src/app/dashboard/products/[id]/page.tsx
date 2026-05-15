import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/components/products/ProductForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // If id is "new", render new product form (handled by /new/page.tsx typically)
  if (id === 'new') {
    return (
      <PageContainer>
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/products" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>
        <PageHeader
          title="Tambah Produk Baru"
          description="Tambahkan produk baru ke dalam sistem warehouse Anda"
        />
        <div className="max-w-2xl">
          <ProductForm />
        </div>
      </PageContainer>
    );
  }

  // Fetch product for editing
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return (
        <PageContainer>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Unauthorized</p>
          </div>
        </PageContainer>
      );
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !product) {
      return (
        <PageContainer>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">
                Produk tidak ditemukan
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/products">Kembali ke Daftar Produk</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/products" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <PageHeader
          title="Edit Produk"
          description={`Edit detail produk: ${product.name}`}
        />

        {/* Form */}
        <div className="max-w-2xl">
          <ProductForm initialData={product as Product} isEditing={true} />
        </div>
      </PageContainer>
    );
  } catch (err) {
    console.error('ProductDetailPage error:', err);
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              Terjadi kesalahan saat memuat produk
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/products">Kembali ke Daftar Produk</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }
}
