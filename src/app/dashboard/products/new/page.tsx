import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/components/products/ProductForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewProductPage() {
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
        title="Tambah Produk Baru"
        description="Tambahkan produk baru ke dalam sistem warehouse Anda"
      />

      {/* Form */}
      <div className="max-w-2xl">
        {true ? (  // atau kondisi loading/data
          <ProductForm />
        ) : (
          <div>Loading form...</div>
        )}
      </div>
    </PageContainer>
  );
}
