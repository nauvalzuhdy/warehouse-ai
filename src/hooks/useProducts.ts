'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/types';

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  search: string;
  category: string;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing product data
 * 
 * Handles fetching, filtering, and deleting products with automatic
 * refetching on filter changes (with debounce for search)
 * 
 * @param initialProducts - Optional array of products to initialize state
 * @example
 * ```typescript
 * const { products, isLoading, search, setSearch, deleteProduct } = useProducts(initialProducts);
 * ```
 */
export function useProducts(initialProducts: Product[] = []): UseProductsReturn {
  // State for products data
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearchState] = useState('');
  const [category, setCategoryState] = useState('');

  // Debounce timer ref for search
  // const searchDebounceRef = useRef<NodeJS.Timeout>();
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fetch products from API with current filters
   */
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const url = `/api/products?${params.toString()}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch products');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Extract the products array from the nested data structure
      // API returns: { success: true, data: { data: [...products], count: number } }
      const productData = data.data?.data || data.data || [];
      console.log('Extracted products:', productData);
      
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Fetch error:', errorMessage);
      setError(errorMessage);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, category]);

  /**
   * Delete a product and refresh the list
   */
  const deleteProduct = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          return {
            success: false,
            error: data.error || 'Failed to delete product',
          };
        }

        // Refresh the product list after successful deletion
        await fetchProducts();

        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [fetchProducts]
  );

  /**
   * Update search filter with debouncing
   */
  const setSearch = useCallback((value: string) => {
    setSearchState(value);
  }, []);

  /**
   * Update category filter
   */
  const setCategory = useCallback((value: string) => {
    setCategoryState(value);
  }, []);

  /**
   * Fetch products on mount and when filters change
   * Only fetch if we have filters (search/category), otherwise use initialProducts
   */
  useEffect(() => {
    if (search || category) {
      // Only fetch if filters are active
      fetchProducts();
    }
  }, [search, category, fetchProducts]);

  return {
    products,
    isLoading,
    error,
    search,
    category,
    setSearch,
    setCategory,
    deleteProduct,
    refetch: fetchProducts,
  };
}
