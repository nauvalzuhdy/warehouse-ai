'use client';

import { WarehouseWithUtilization, getUtilizationStatus } from '@/types';
import { formatNumber } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Warehouse,
  MapPin,
  Package,
  Pencil,
  Trash2,
  MoreVertical,
} from 'lucide-react';

interface WarehouseCardProps {
  warehouse: WarehouseWithUtilization;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function WarehouseCard({
  warehouse,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  const status = getUtilizationStatus(warehouse.utilization_percent);

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Hapus gudang ${warehouse.name}? Gudang hanya bisa dihapus jika tidak ada stok aktif.`
    );
    if (confirmed) {
      onDelete(warehouse.id, warehouse.name);
    }
  };

  // Status color mappings
  const statusColors = {
    safe: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-orange-600',
    critical: 'text-red-600',
  };

  const progressColors = {
    safe: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  const badgeVariants = {
    safe: { variant: 'outline' as const, className: 'border-green-200 bg-green-50 text-green-700' },
    warning: { variant: 'outline' as const, className: 'border-amber-200 bg-amber-50 text-amber-700' },
    danger: { variant: 'outline' as const, className: 'border-orange-200 bg-orange-50 text-orange-700' },
    critical: { variant: 'outline' as const, className: 'border-red-200 bg-red-50 text-red-700' },
  };

  const statusLabels = {
    safe: 'Aman',
    warning: 'Perhatian',
    danger: 'Hampir Penuh',
    critical: 'Kritis',
  };

  return (
    <Card className="rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        {/* Header: Warehouse Icon + Name + Dropdown Menu */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Warehouse className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{warehouse.name}</h3>

              {/* Location Badge */}
              {warehouse.location && (
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{warehouse.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(warehouse.id)}>
                <Pencil className="w-4 h-4 mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Stok */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-500">Total Stok</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(warehouse.total_stock)} unit
            </p>
          </div>

          {/* Kapasitas */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Warehouse className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-500">Kapasitas</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(warehouse.max_capacity)} unit
            </p>
          </div>
        </div>

        {/* Capacity Bar Section */}
        <div className="space-y-2">
          {/* Label Row */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Kapasitas Terpakai</span>
            <span className={`text-sm font-bold ${statusColors[status]}`}>
              {warehouse.utilization_percent.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="overflow-hidden rounded-full bg-gray-200 h-2">
            <div
              className={`h-full ${progressColors[status]} transition-all duration-300`}
              style={{ width: `${Math.min(warehouse.utilization_percent, 100)}%` }}
            />
          </div>

          {/* Status Badge */}
          <div className="flex justify-end">
            <Badge
              variant={badgeVariants[status].variant}
              className={badgeVariants[status].className}
            >
              {statusLabels[status]}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
