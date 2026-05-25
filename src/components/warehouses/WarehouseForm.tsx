'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Warehouse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Zod schema for warehouse form validation
const warehouseFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama gudang wajib diisi')
    .max(100, 'Nama gudang maksimal 100 karakter'),
  location: z
    .string()
    .max(200, 'Lokasi maksimal 200 karakter')
    .optional()
    .or(z.literal('')),
  capacity: z.coerce
    .number({ error: 'Kapasitas harus berupa angka positif' })
    .int('Kapasitas harus berupa bilangan bulat')
    .min(1, 'Kapasitas minimal 1'),
  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
});

type WarehouseFormData = z.infer<typeof warehouseFormSchema>;

interface WarehouseFormProps {
  warehouse?: Warehouse;
}

export function WarehouseForm({ warehouse }: WarehouseFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditMode = !!warehouse;

    const {
    register,
    handleSubmit,
    formState: { errors },
    } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseFormSchema) as any, // ← tambahkan as any
    defaultValues: {
        name: warehouse?.name || '',
        location: warehouse?.location || '',
        capacity: warehouse?.max_capacity || undefined,
        description: (warehouse as any)?.description || '',
    },
    });

  const onSubmit = async (data: WarehouseFormData) => {
    setIsPending(true);
    setServerError(null);

    try {
      const url = isEditMode
        ? `/api/warehouses/${warehouse.id}`
        : '/api/warehouses';

      const method = isEditMode ? 'PATCH' : 'POST';

      const payload = {
        name: data.name,
        location: data.location || null,
        capacity: data.capacity,
        description: data.description || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerError(errorData.error || 'Gagal menyimpan gudang');
        setIsPending(false);
        return;
      }

      // Success - redirect to warehouses page
      router.push('/dashboard/warehouses');
    } catch (error) {
      console.error('Error submitting form:', error);
      setServerError('Terjadi kesalahan. Silakan coba lagi.');
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit Gudang' : 'Tambah Gudang Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Server Error Alert */}
          {serverError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {serverError}
            </div>
          )}

          {/* Nama Gudang */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">
              Nama Gudang <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Gudang Utama"
              {...register('name')}
              disabled={isPending}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Lokasi */}
          <div className="space-y-2">
            <Label htmlFor="location" className="font-medium">
              Lokasi
            </Label>
            <Input
              id="location"
              placeholder="Jl. Raya No. 1, Jakarta Utara"
              {...register('location')}
              disabled={isPending}
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Kapasitas */}
          <div className="space-y-2">
            <Label htmlFor="capacity" className="font-medium">
              Kapasitas (unit) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="5000"
              {...register('capacity')}
              disabled={isPending}
              className={errors.capacity ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-600">
              Jumlah maksimum unit yang bisa disimpan
            </p>
            {errors.capacity && (
              <p className="text-sm text-red-600">{errors.capacity.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              placeholder="Deskripsi gudang..."
              {...register('description')}
              disabled={isPending}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/warehouses')}
              disabled={isPending}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Tambah Gudang'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
