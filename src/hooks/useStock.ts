'use client';

import { useState, useEffect, useCallback } from 'react';
import { StockWithDetails } from '@/types';

/**
 * Payload for updating stock quantity
 */
interface UpdateStockPayload {
  quantity_change: number;
  type: 'in' | 'out' | 'adjustment';
  notes?: string;
}

/**
 * Return type for updateStock function
 */
interface UpdateStockResult {
  success: boolean;
  error?: string;
}

/**
 * Custom hook for managing stock operations
 *
 * @example
 * ```typescript
 * const {
 *   stocks,
 *   isLoading,
 *   error,
 *   warehouseFilter,
 *   setWarehouseFilter,
 *   updateStock,
 *   refetch
 * } = useStock();
 * ```
 */
export function useStock() {
  const [stocks, setStocks] = useState<StockWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warehouseFilter, setWarehouseFilterState] = useState('');

  /**
   * Fetch stock data from API
   */
  const fetchStock = useCallback(async (warehouse?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (warehouse) {
        params.append('warehouse_id', warehouse);
      }

      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/stock${query}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch stock');
      }

      const data = await response.json();
      if (data.success) {
        setStocks(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch stock');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching stock:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update stock quantity
   */
  const updateStock = useCallback(
    async (stockId: string, payload: UpdateStockPayload): Promise<UpdateStockResult> => {
      try {
        const response = await fetch(`/api/stock/${stockId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Failed to update stock',
          };
        }

        if (data.success) {
          // Refresh the stocks list after successful update
          await fetchStock(warehouseFilter || undefined);
          return { success: true };
        } else {
          return {
            success: false,
            error: data.error || 'Failed to update stock',
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error updating stock:', err);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [fetchStock, warehouseFilter]
  );

  /**
   * Set warehouse filter and auto-refetch
   */
  const setWarehouseFilter = useCallback(
    async (warehouseId: string) => {
      setWarehouseFilterState(warehouseId);
      // Fetch with the new filter
      await fetchStock(warehouseId || undefined);
    },
    [fetchStock]
  );

  /**
   * Initial fetch on component mount
   */
  useEffect(() => {
    fetchStock(warehouseFilter || undefined);
  }, []);

  return {
    stocks,
    isLoading,
    error,
    warehouseFilter,
    setWarehouseFilter,
    updateStock,
    refetch: fetchStock,
  };
}
