'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductFormProps {
  initialData?: {
    id?: string;
    name?: string;
    sku?: string;
    category?: string | null;
    price?: number | null;
    unit?: string | null;
    description?: string | null;
  };
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    category: initialData?.category || '',
    price: initialData?.price ? String(initialData.price) : '',
    unit: initialData?.unit || '',
    description: initialData?.description || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.sku.trim()) {
        setError('Nama produk dan SKU tidak boleh kosong');
        setIsLoading(false);
        return;
      }

      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category || null,
        price: formData.price ? parseFloat(formData.price) : null,
        unit: formData.unit || null,
        description: formData.description || null,
      };

      console.log('Submitting product:', payload);

      const url = isEditing && initialData?.id
        ? `/api/products/${initialData.id}`
        : '/api/products';

      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      // Success - redirect to products page
      router.push('/dashboard/products');
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Submit error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">
                <span className="font-semibold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Nama Produk */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Cth: Mie Instan"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
            <Input
              id="sku"
              name="sku"
              placeholder="Cth: SKU-001"
              value={formData.sku}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              SKU harus unik untuk setiap produk
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category" disabled={isLoading}>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tanpa Kategori</SelectItem>
                <SelectItem value="Makanan">Makanan</SelectItem>
                <SelectItem value="Minuman">Minuman</SelectItem>
                <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Cth: 5000"
              value={formData.price}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label htmlFor="unit">Satuan</Label>
            <Input
              id="unit"
              name="unit"
              placeholder="Cth: pack, pcs, botol"
              value={formData.unit}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Deskripsi produk (optional)"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? isEditing
                  ? 'Menyimpan...'
                  : 'Menambahkan...'
                : isEditing
                ? 'Simpan Perubahan'
                : 'Tambah Produk'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
