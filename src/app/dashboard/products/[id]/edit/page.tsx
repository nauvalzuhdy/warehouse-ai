import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/products";

// ✅ FIX 1: Interface harus di LUAR function, bukan di dalam
interface Props {
  params: Promise<{ id: string }>; // ✅ FIX 2: params adalah Promise di Next.js 15
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params; // ✅ await params dulu sebelum dipakai

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    notFound();
  }

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Produk"
        description={`Memperbarui informasi untuk ${product.name}`}
        action={
          <Button variant="ghost" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Link>
          </Button>
        }
      />
      <div className="max-w-3xl mx-auto">
        <ProductForm initialData={product} isEditing={true} />
      </div>
    </PageContainer>
  );
}