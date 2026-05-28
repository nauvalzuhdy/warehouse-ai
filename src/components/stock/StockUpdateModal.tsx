'use client';

import { useState } from 'react';
import { StockWithDetails } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockUpdateModalProps {
  stock: StockWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (stockId: string, payload: {
    quantity_change: number;
    type: 'in' | 'out' | 'adjustment';
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function StockUpdateModal({
  stock,
  isOpen,
  onClose,
  onUpdate,
}: StockUpdateModalProps) {
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!stock) return null;

  const currentQuantity = stock.quantity;
  const quantityNum = quantity ? parseInt(quantity, 10) : 0;
  const isValidQuantity = quantity && !isNaN(quantityNum) && quantityNum >= 0;

  // Calculate the new quantity based on type
  let newQuantity = currentQuantity;
  let quantityChange = 0;

  if (type === 'in') {
    newQuantity = currentQuantity + quantityNum;
    quantityChange = quantityNum;
  } else if (type === 'out') {
    newQuantity = currentQuantity - quantityNum;
    quantityChange = -quantityNum;
  } else if (type === 'adjustment') {
    // For adjustment, quantity input is absolute value
    newQuantity = quantityNum;
    quantityChange = quantityNum - currentQuantity;
  }

  const getQuantityLabel = () => {
    switch (type) {
      case 'in':
        return 'Jumlah Masuk';
      case 'out':
        return 'Jumlah Keluar';
      case 'adjustment':
        return 'Jumlah Akhir';
    }
  };

  const getQuantityHint = () => {
    if (type === 'adjustment') {
      return 'Masukkan jumlah stok yang seharusnya ada';
    }
    return undefined;
  };

  const getPreviewText = () => {
    const unitStr = stock.product.unit ? ` ${stock.product.unit}` : '';
    
    if (type === 'in') {
      return `Stok: ${currentQuantity} → ${currentQuantity} + ${quantityNum} = ${newQuantity}${unitStr}`;
    } else if (type === 'out') {
      const textColor = newQuantity === 0 ? ' text-red-600' : '';
      return `Stok: ${currentQuantity} → ${currentQuantity} - ${quantityNum} = ${newQuantity}${unitStr}`;
    } else {
      return `Stok: ${currentQuantity} → ${newQuantity}${unitStr}`;
    }
  };

  const handleSubmit = async () => {
    if (!isValidQuantity) {
      setError('Jumlah harus berupa angka positif');
      return;
    }

    if (type === 'out' && newQuantity < 0) {
      setError(`Stok tidak cukup. Stok saat ini: ${currentQuantity} unit.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await onUpdate(stock.id, {
        quantity_change: quantityChange,
        type,
        notes: notes || undefined,
      });

      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Gagal memperbarui stok');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setType('in');
    setQuantity('');
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Stok — {stock.product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Row */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
            <div>
              <p className="text-gray-600">{stock.warehouse.name}</p>
              <p className="font-semibold">
                Stok saat ini: {currentQuantity} {stock.product.unit || 'unit'}
              </p>
            </div>
          </div>

          {/* Type Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipe Perubahan Stok</Label>
            <div className="flex gap-2">
              {[
                { value: 'in' as const, label: 'Stok Masuk', icon: ArrowDownToLine, color: 'green' },
                { value: 'out' as const, label: 'Stok Keluar', icon: ArrowUpFromLine, color: 'red' },
                { value: 'adjustment' as const, label: 'Adjustment', icon: SlidersHorizontal, color: 'blue' },
              ].map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    type === value
                      ? {
                          green: 'bg-green-600 text-white',
                          red: 'bg-red-600 text-white',
                          blue: 'bg-blue-600 text-white',
                        }[color]
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              {getQuantityLabel()}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="text-base"
            />
            {getQuantityHint() && (
              <p className="text-xs text-gray-500">{getQuantityHint()}</p>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Catatan
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan (opsional)"
              className="min-h-20 text-sm"
            />
          </div>

          {/* Preview */}
          {isValidQuantity && (
            <div className={cn(
              'rounded-lg p-3 text-sm font-medium',
              type === 'out' && newQuantity === 0
                ? 'bg-red-50 text-red-700'
                : 'bg-blue-50 text-blue-700'
            )}>
              {getPreviewText()}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              variant="ghost"
              className="flex-1"
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValidQuantity || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
