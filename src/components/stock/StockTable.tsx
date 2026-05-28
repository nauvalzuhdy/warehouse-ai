'use client';

import { useState, useMemo } from 'react';
import { StockWithDetails, Warehouse } from '@/types';
import { useStock } from '@/hooks/useStock';
import { StockUpdateModal } from './StockUpdateModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockTableProps {
  initialStocks: StockWithDetails[];
  warehouses: Warehouse[];
}

export function StockTable({ initialStocks, warehouses }: StockTableProps) {
  const { stocks, isLoading, warehouseFilter, setWarehouseFilter, updateStock } = useStock();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter stocks based on search query (product name or SKU)
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        stock.product.name.toLowerCase().includes(searchLower) ||
        stock.product.sku.toLowerCase().includes(searchLower)
      );
    });
  }, [stocks, searchQuery]);

  const getStockStatus = (quantity: number): { label: string; color: 'destructive' | 'outline' | 'secondary' | 'default' } => {
    if (quantity === 0) {
      return { label: 'Habis', color: 'destructive' };
    }
    if (quantity <= 10) {
      return { label: 'Kritis', color: 'destructive' };
    }
    if (quantity <= 50) {
      return { label: 'Rendah', color: 'outline' };
    }
    return { label: 'Normal', color: 'default' };
  };

  const getQuantityColor = (quantity: number): string => {
    if (quantity <= 10) {
      return 'text-red-600';
    }
    if (quantity <= 50) {
      return 'text-amber-600';
    }
    return 'text-gray-900';
  };

  const getWarehouseName = (warehouseId: string): string => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse?.name || 'Unknown';
  };

  const warehouseDisplayName =
    warehouseFilter && warehouseFilter !== ''
      ? warehouses.find((w) => w.id === warehouseFilter)?.name
      : 'semua gudang';

  // Show warehouse column only if no filter is applied
  const showWarehouseColumn = !warehouseFilter || warehouseFilter === '';

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Select 
            value={warehouseFilter || 'all'} 
            onValueChange={(val) => setWarehouseFilter(val === 'all' ? '' : val)}
          >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Pilih Gudang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Gudang</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Cari produk atau SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      {/* Count Info */}
      <div className="text-sm text-gray-600">
        Menampilkan {filteredStocks.length} produk di {warehouseDisplayName}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              {showWarehouseColumn && <TableHead>Gudang</TableHead>}
              <TableHead className="text-right">Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state - 5 skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  {showWarehouseColumn && (
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredStocks.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={showWarehouseColumn ? 5 : 4}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Package className="h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">Belum ada data stok</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              filteredStocks.map((stock) => {
                const status = getStockStatus(stock.quantity);
                const quantityColor = getQuantityColor(stock.quantity);

                return (
                  <TableRow key={stock.id}>
                    {/* Product */}
                    <TableCell>
                      <div>
                        <p className="font-medium">{stock.product.name}</p>
                        <p className="text-xs text-gray-500">{stock.product.sku}</p>
                      </div>
                    </TableCell>

                    {/* Warehouse (conditionally shown) */}
                    {showWarehouseColumn && (
                      <TableCell>
                        <div>
                          <p className="text-sm">{stock.warehouse.name}</p>
                          {stock.warehouse.location && (
                            <p className="text-xs text-gray-500">{stock.warehouse.location}</p>
                          )}
                        </div>
                      </TableCell>
                    )}

                    {/* Stock Quantity */}
                    <TableCell className="text-right">
                      <p className={cn('font-mono font-semibold', quantityColor)}>
                        {stock.quantity} {stock.product.unit || 'unit'}
                      </p>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStock(stock);
                          setIsModalOpen(true);
                        }}
                      >
                        Update Stok
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stock Update Modal */}
      <StockUpdateModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={updateStock}
      />
    </div>
  );
}
