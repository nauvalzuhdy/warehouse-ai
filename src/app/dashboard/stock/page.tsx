import { createClient } from '@/lib/supabase/server';
import { StockWithDetails, Warehouse } from '@/types';
import { formatNumber } from '@/lib/utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { StockTable } from '@/components/stock/StockTable';
import { AlertCircle, Package } from 'lucide-react';

export default async function StockPage() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return (
        <PageContainer>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Unauthorized</p>
          </div>
        </PageContainer>
      );
    }

    // ✅ Ambil warehouse milik user dulu
    const { data: userWarehouses } = await supabase
      .from('warehouses')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    const warehouseIds = userWarehouses?.map(w => w.id) || [];

    if (warehouseIds.length === 0) {
      return (
        <PageContainer>
          <PageHeader
            title="Manajemen Stok"
            description="Pantau dan update stok produk di setiap gudang."
          />
          <div className="mt-8 flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              Belum ada gudang. Tambahkan gudang terlebih dahulu.
            </p>
          </div>
        </PageContainer>
      );
    }

    // ✅ Fetch stock hanya dari warehouse milik user
    const { data: stocks, error: stocksError } = await supabase
      .from('stock')
      .select('*, product:products(*), warehouse:warehouses(*)')
      .in('warehouse_id', warehouseIds);

    if (stocksError) {
      console.error('Error fetching stocks:', stocksError);
      return (
        <PageContainer>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Gagal memuat data stok</p>
          </div>
        </PageContainer>
      );
    }

    const filteredStocks = (stocks || []).filter(
      (stock: any) => stock.product?.is_active && stock.warehouse?.is_active
    ) as StockWithDetails[];

    // ✅ Warehouse list juga hanya milik user
    const { data: warehouses } = await supabase
      .from('warehouses')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    const warehouseList = (warehouses || []) as Warehouse[];

    const totalSku = new Set(filteredStocks.map((s) => s.product_id)).size;
    const totalUnit = filteredStocks.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const stockKritis = filteredStocks.filter((s) => s.quantity <= 10 && s.quantity > 0).length;
    const stockHabis = filteredStocks.filter((s) => s.quantity === 0).length;

    return (
      <PageContainer>
        <PageHeader
          title="Manajemen Stok"
          description="Pantau dan update stok produk di setiap gudang."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total SKU"
            value={totalSku}
            icon={<Package className="h-5 w-5" />}
          />
          <StatCard
            title="Total Unit"
            value={formatNumber(totalUnit)}
            icon={<Package className="h-5 w-5" />}
          />
          <StatCard
            title="Stok Kritis"
            value={stockKritis}
            icon={<AlertCircle className="h-5 w-5" />}
            trend={stockKritis > 0 ? { value: stockKritis, isPositive: false } : undefined}
          />
          <StatCard
            title="Stok Habis"
            value={stockHabis}
            icon={<AlertCircle className="h-5 w-5" />}
            trend={stockHabis > 0 ? { value: stockHabis, isPositive: false } : undefined}
          />
        </div>

        <div className="mt-8">
          <StockTable
            initialStocks={filteredStocks}
            warehouses={warehouseList}
          />
        </div>
      </PageContainer>
    );
  } catch (error) {
    console.error('StockPage error:', error);
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Terjadi kesalahan</p>
        </div>
      </PageContainer>
    );
  }
}