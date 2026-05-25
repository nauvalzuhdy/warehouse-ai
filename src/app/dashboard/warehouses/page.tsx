import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';
import { WarehouseWithUtilization } from '@/types';
import { WarehouseGrid } from '@/components/warehouses/WarehouseGrid';

/**
 * Server component that fetches and displays warehouses
 */
export default async function WarehousesPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600">Error: Unauthorized</p>
        </div>
      </PageContainer>
    );
  }

  // Query warehouses for the authenticated user
  const { data: warehouses, error: warehouseError } = await supabase
    .from('warehouses')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (warehouseError) {
    console.error('Error fetching warehouses:', warehouseError);
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600">Error: Failed to fetch warehouses</p>
        </div>
      </PageContainer>
    );
  }

  // Calculate utilization for each warehouse
  const warehousesWithUtilization: WarehouseWithUtilization[] = await Promise.all(
    (warehouses || []).map(async (warehouse) => {
      // Query total stock for this warehouse
      const { data: stockData, error: stockError } = await supabase
        .from('stock')
        .select('quantity')
        .eq('warehouse_id', warehouse.id);

      if (stockError) {
        console.error(
          `Error fetching stock for warehouse ${warehouse.id}:`,
          stockError
        );
        return {
          ...warehouse,
          total_stock: 0,
          utilization_percent: 0,
        };
      }

      // Sum quantities
      const total_stock = (stockData || []).reduce(
        (sum, stock) => sum + (stock.quantity || 0),
        0
      );

      // Calculate utilization percentage
      const utilization_percent =
        warehouse.max_capacity > 0
          ? Math.min((total_stock / warehouse.max_capacity) * 100, 100)
          : 0;

      return {
        ...warehouse,
        total_stock,
        utilization_percent,
      };
    })
  );

  // Calculate summary stats
  const totalWarehouses = warehousesWithUtilization.length;
  const totalCapacity = warehousesWithUtilization.reduce(
    (sum, w) => sum + w.max_capacity,
    0
  );
  const averageUtilization =
    warehousesWithUtilization.length > 0
      ? warehousesWithUtilization.reduce((sum, w) => sum + w.utilization_percent, 0) /
        warehousesWithUtilization.length
      : 0;

  return (
    <PageContainer>
      <div className="flex items-start justify-between mb-8">
        <PageHeader
          title="Gudang"
          description="Kelola gudang dan pantau kapasitas penyimpanan."
        />
        <Link href="/dashboard/warehouses/new">
          <Button>Tambah Gudang</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      {warehousesWithUtilization.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Gudang */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Gudang
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalWarehouses}
            </p>
          </div>

          {/* Total Kapasitas */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Kapasitas
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(totalCapacity)}{' '}
              <span className="text-base font-normal text-gray-600">unit</span>
            </p>
          </div>

          {/* Rata-rata Utilisasi */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Rata-rata Utilisasi
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {averageUtilization.toFixed(1)}{' '}
              <span className="text-base font-normal text-gray-600">%</span>
            </p>
          </div>
        </div>
      )}

      {/* Warehouse Grid */}
      <WarehouseGrid initialWarehouses={warehousesWithUtilization} />
    </PageContainer>
  );
}
