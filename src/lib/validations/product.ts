import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .nonempty("Nama produk wajib diisi")
    .min(2, "Nama produk minimal 2 karakter")
    .max(100, "Nama produk maksimal 100 karakter"),
  sku: z
    .string()
    .nonempty("SKU wajib diisi")
    .min(2, "SKU minimal 2 karakter")
    .max(50)
    .transform((val) => val.toUpperCase()),
  category: z.string().default(''),
  price: z
    .number()
    .nullable()
    .optional()
    .refine(val => val === null || val === undefined || val > 0, {
      message: "Harga harus berupa angka positif"
    })
    .refine(val => val === null || val === undefined || val <= 999999999, {
      message: "Harga harus berupa angka positif"
    }),
  unit: z.string().default("pcs"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .default(''),
});

export type ProductFormData = z.infer<typeof productSchema>;
