import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { WarehouseForm } from '@/components/warehouses/WarehouseForm';

export default function NewWarehousePage() {
  return (
    <PageContainer>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/warehouses" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <PageHeader title="Tambah Gudang" />

      {/* Form */}
      <div className="max-w-lg">
        <WarehouseForm />
      </div>
    </PageContainer>
  );
}
