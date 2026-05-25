import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { WarehouseForm } from '@/components/warehouses/WarehouseForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWarehousePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    notFound();
  }

  const { data: warehouse, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !warehouse) {
    notFound();
  }

  return (
    <PageContainer>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/warehouses" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Edit Gudang"
        description={warehouse.name}
      />

      {/* Form */}
      <div className="max-w-lg">
        <WarehouseForm warehouse={warehouse} />
      </div>
    </PageContainer>
  );
}
