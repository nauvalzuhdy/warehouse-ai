import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loading component for ProductsTable
 * Displays 5 skeleton rows with the same column structure
 */
export function TableSkeleton() {
  return (
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
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
              {/* Produk: two skeletons stacked (name + SKU) */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>

              {/* Kategori */}
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>

              {/* Harga */}
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* Unit */}
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>

              {/* Status */}
              <TableCell>
                <Skeleton className="h-6 w-14 rounded-full" />
              </TableCell>

              {/* Aksi: two small round skeletons side by side */}
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
