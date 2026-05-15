'use client';

import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks';
import { Product } from '@/types';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  SearchX,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface ProductsTableProps {
  initialProducts: Product[];
}

/**
 * Products table component for displaying and managing products
 * with search, filtering, and action capabilities
 */
export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const router = useRouter();
  
  // Debug logging
  console.log('ProductsTable received initialProducts:', initialProducts.length, initialProducts);
  
  const {
    products,
    isLoading,
    error,
    search,
    category,
    setSearch,
    setCategory,
    deleteProduct,
  } = useProducts(initialProducts);
  
  console.log('ProductsTable current products:', products.length, products);
  console.log('ProductsTable state - isLoading:', isLoading, 'search:', search, 'category:', category);

  /**
   * Format price as Rupiah currency
   */
  const formatRupiah = (price: number | null): string => {
    if (!price) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  /**
   * Handle product deletion with confirmation
   */
  const handleDeleteProduct = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Hapus produk ${name}? Stok produk ini juga akan dihapus.`
    );

    if (!confirmed) return;

    const result = await deleteProduct(id);
    if (!result.success) {
      alert(`Error: ${result.error || 'Gagal menghapus produk'}`);
    }
  };

  /**
   * Check if no products and no search/category filters are active
   */
  const isEmptyWithNoFilters = products.length === 0 && !search && !category;

  /**
   * Check if no search results
   */
  const isEmptyWithFilters = products.length === 0 && (search || category);

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Top Bar: Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau SKU produk..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters and Add Button */}
        <div className="flex gap-2">
            <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? "" : val)}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>  {/* 👈 bukan "" */}
                <SelectItem value="Makanan">Makanan</SelectItem>
                <SelectItem value="Minuman">Minuman</SelectItem>
                <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
            </Select>

          <Button
            onClick={() => router.push('/dashboard/products/new')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Produk</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead className="hidden sm:table-cell">Kategori</TableHead>
              <TableHead className="hidden sm:table-cell">Harga</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading State */}
            {isLoading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="h-4 w-32 rounded bg-muted" />
                        <div className="h-3 w-20 rounded bg-muted" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="h-4 w-20 rounded bg-muted" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="h-4 w-24 rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-14 rounded bg-muted" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 rounded bg-muted" />
                        <div className="h-8 w-8 rounded bg-muted" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}

            {/* Empty State - No Products */}
            {!isLoading && isEmptyWithNoFilters && (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <Package className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        Belum ada produk
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mulai tambahkan produk untuk melacak stok di gudang
                        kamu.
                      </p>
                    </div>
                    <Button
                      onClick={() => router.push('/dashboard/products/new')}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Produk Pertama
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Empty State - No Search Results */}
            {!isLoading && isEmptyWithFilters && (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <SearchX className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        Produk tidak ditemukan
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Coba ubah kata kunci pencarian atau reset filter.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch('');
                        setCategory('');
                      }}
                    >
                      Reset Filter
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Product Rows */}
            {!isLoading &&
              products.map((product) => (
                <TableRow key={product.id}>
                  {/* Produk */}
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sku}
                      </p>
                    </div>
                  </TableCell>

                  {/* Kategori */}
                  <TableCell className="hidden sm:table-cell">
                    {product.category ? (
                      <Badge variant="outline">{product.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  {/* Harga */}
                  <TableCell className="hidden sm:table-cell">
                    {formatRupiah(product.price)}
                  </TableCell>

                  {/* Unit */}
                  <TableCell>
                    {product.unit || '-'}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="default" className="bg-green-600">
                      Aktif
                    </Badge>
                  </TableCell>

                  {/* Aksi */}
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          router.push(
                            `/dashboard/products/${product.id}/edit`
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          handleDeleteProduct(product.id, product.name)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
