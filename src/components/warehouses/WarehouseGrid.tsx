'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WarehouseWithUtilization } from '@/types';
import { WarehouseCard } from './WarehouseCard';
import { Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WarehouseGridProps {
  initialWarehouses: WarehouseWithUtilization[];
}

export function WarehouseGrid({ initialWarehouses }: WarehouseGridProps) {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<WarehouseWithUtilization[]>(
    initialWarehouses
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/warehouses/${id}/edit`);
  };

  const handleDelete = async (id: string, name: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus gudang');
        setIsDeleting(null);
        return;
      }

      // Remove from local state
      setWarehouses(warehouses.filter((w) => w.id !== id));
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      alert('Gagal menghapus gudang');
      setIsDeleting(null);
    }
  };

  if (warehouses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-4 bg-blue-100 rounded-full mb-4">
          <Warehouse className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Belum ada gudang
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
          Tambahkan gudang pertama untuk mulai melacak stok.
        </p>
        <Button onClick={() => router.push('/dashboard/warehouses/new')}>
          Tambah Gudang Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {warehouses.map((warehouse) => (
        <WarehouseCard
          key={warehouse.id}
          warehouse={warehouse}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
