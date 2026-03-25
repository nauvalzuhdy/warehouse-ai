/**
 * Global TypeScript types for the Warehouse AI Management System
 * This file contains all shared type definitions used throughout the application
 */

/**
 * Generic API response wrapper
 * Used for standardizing all API responses across the application
 * @template T - The type of data returned in the response
 *
 * @example
 * ```typescript
 * const response: ApiResponse<Product[]> = await fetch('/api/products');
 * if (response.success) {
 *   console.log(response.data); // Product[]
 * }
 * ```
 */
export interface ApiResponse<T = unknown> {
  /** Indicates whether the request was successful */
  success: boolean;
  /** The data returned from the API (present if success is true) */
  data?: T;
  /** Error message (present if success is false) */
  error?: string;
}

/**
 * User type representing an authenticated user in the system
 * Used for user profile information and authentication checks
 *
 * @example
 * ```typescript
 * const currentUser: User = {
 *   id: '123',
 *   email: 'user@example.com',
 *   created_at: '2026-01-15T10:30:00Z'
 * };
 * ```
 */
export interface User {
  /** Unique identifier for the user (UUID) */
  id: string;
  /** User's email address (unique) */
  email: string;
  /** ISO timestamp when the user account was created */
  created_at: string;
}

/**
 * Product type representing inventory items in the system
 * Used for managing products across warehouses
 *
 * @example
 * ```typescript
 * const product: Product = {
 *   id: 'prod-123',
 *   user_id: 'user-456',
 *   name: 'Wireless Mouse',
 *   sku: 'SKU-WM-001',
 *   category: 'Electronics',
 *   price: 29.99,
 *   created_at: '2026-01-20T08:00:00Z'
 * };
 * ```
 */
export interface Product {
  /** Unique identifier for the product (UUID) */
  id: string;
  /** User/owner ID who created the product */
  user_id: string;
  /** Product name/title */
  name: string;
  /** Stock Keeping Unit for inventory tracking */
  sku: string;
  /** Product category (optional) */
  category: string | null;
  /** Product price in decimal format (optional) */
  price: number | null;
  /** ISO timestamp when the product was created */
  created_at: string;
}

/**
 * Warehouse type representing storage locations
 * Used for managing multiple warehouse locations and their capacity
 *
 * @example
 * ```typescript
 * const warehouse: Warehouse = {
 *   id: 'wh-123',
 *   user_id: 'user-456',
 *   name: 'Main Warehouse',
 *   location: 'New York, NY',
 *   max_capacity: 10000,
 *   created_at: '2026-01-10T12:00:00Z'
 * };
 * ```
 */
export interface Warehouse {
  /** Unique identifier for the warehouse (UUID) */
  id: string;
  /** User/owner ID who created the warehouse */
  user_id: string;
  /** Warehouse name/title */
  name: string;
  /** Physical location of the warehouse (optional) */
  location: string | null;
  /** Maximum storage capacity (in units) */
  max_capacity: number;
  /** ISO timestamp when the warehouse was created */
  created_at: string;
}

/**
 * Stock type representing inventory quantities in specific warehouses
 * Used for tracking product quantities across different warehouse locations
 *
 * @example
 * ```typescript
 * const stock: Stock = {
 *   id: 'stock-123',
 *   product_id: 'prod-456',
 *   warehouse_id: 'wh-789',
 *   quantity: 150,
 *   updated_at: '2026-03-25T14:30:00Z'
 * };
 * ```
 */
export interface Stock {
  /** Unique identifier for the stock record (UUID) */
  id: string;
  /** Reference to the product */
  product_id: string;
  /** Reference to the warehouse location */
  warehouse_id: string;
  /** Current quantity in stock */
  quantity: number;
  /** ISO timestamp when the stock was last updated */
  updated_at: string;
}

/**
 * StockWithDetails type extending Stock with related Product and Warehouse data
 * Used when displaying stock information with full product and warehouse context
 *
 * @example
 * ```typescript
 * const stockDetail: StockWithDetails = {
 *   id: 'stock-123',
 *   product_id: 'prod-456',
 *   warehouse_id: 'wh-789',
 *   quantity: 150,
 *   updated_at: '2026-03-25T14:30:00Z',
 *   product: { id: 'prod-456', ... },
 *   warehouse: { id: 'wh-789', ... }
 * };
 * ```
 */
export interface StockWithDetails extends Stock {
  /** Full product information */
  product: Product;
  /** Full warehouse information */
  warehouse: Warehouse;
}

/**
 * InsightItem type representing a single AI-generated insight
 * Used as part of AI analysis results
 *
 * @example
 * ```typescript
 * const insight: InsightItem = {
 *   title: 'Low Stock Alert',
 *   description: 'Product SKU-001 is running low',
 *   priority: 'high',
 *   action: 'Reorder 500 units'
 * };
 * ```
 */
export interface InsightItem {
  /** Title/heading of the insight */
  title: string;
  /** Detailed description of the insight */
  description: string;
  /** Priority level of this insight */
  priority: 'critical' | 'high' | 'medium' | 'low';
  /** Recommended action to take (optional) */
  action: string | null;
}

/**
 * AiInsight type representing a collection of AI-generated insights
 * Used for AI chat analysis and warehouse insights endpoints
 *
 * @example
 * ```typescript
 * const analysis: AiInsight = {
 *   summary: 'Analysis of warehouse stock levels',
 *   items: [
 *     { title: 'Low Stock', description: '...', priority: 'high', action: '...' },
 *     { title: 'Overstock', description: '...', priority: 'medium', action: null }
 *   ],
 *   generated_at: '2026-03-25T15:00:00Z',
 *   model: 'gpt-4'
 * };
 * ```
 */
export interface AiInsight {
  /** High-level summary of the analysis */
  summary: string;
  /** Array of individual insights from the analysis */
  items: InsightItem[];
  /** ISO timestamp when the insight was generated */
  generated_at: string;
  /** AI model used to generate this insight */
  model: string;
}

/**
 * ChatMessage type representing a single message in a chat conversation
 * Used for AI chat feature and message history
 *
 * @example
 * ```typescript
 * const message: ChatMessage = {
 *   id: 'msg-123',
 *   role: 'user',
 *   content: 'What products are low in stock?',
 *   created_at: '2026-03-25T16:00:00Z'
 * };
 * ```
 */
export interface ChatMessage {
  /** Unique identifier for the message (UUID) */
  id: string;
  /** Role of the message sender */
  role: 'user' | 'assistant';
  /** Message content/text */
  content: string;
  /** ISO timestamp when the message was created */
  created_at: string;
}
