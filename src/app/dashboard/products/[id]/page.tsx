import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  // Redirect to edit page
  redirect(`/dashboard/products/${id}/edit`);
}
