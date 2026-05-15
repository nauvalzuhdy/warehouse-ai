// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Package,
//   Warehouse,
//   AlertTriangle,
//   BarChart3,
//   Sparkles,
//   LogOut,
// } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { PageContainer } from '@/components/layout/PageContainer';
// import { PageHeader } from '@/components/layout/PageHeader';
// import { StatCard } from '@/components/dashboard/StatCard';
// import { createClient } from '@/lib/supabase/client';

// export default function DashboardPage() {
//   const router = useRouter();
//   const supabase = createClient();

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push('/login');
//   };

//   const stats = [
//     {
//       title: 'Total Produk',
//       value: '0',
//       description: 'produk terdaftar',
//       icon: <Package className="w-5 h-5" />,
//     },
//     {
//       title: 'Total Gudang',
//       value: '0',
//       description: 'gudang aktif',
//       icon: <Warehouse className="w-5 h-5" />,
//     },
//     {
//       title: 'Item Stok Rendah',
//       value: '0',
//       description: 'perlu perhatian',
//       icon: <AlertTriangle className="w-5 h-5" />,
//     },
//     {
//       title: 'Total Stok',
//       value: '0',
//       description: 'unit di semua gudang',
//       icon: <BarChart3 className="w-5 h-5" />,
//     },
//   ];

//   return (
//     <PageContainer>
//       <div className="flex items-start justify-between mb-6">
//         <PageHeader
//           title="Dashboard"
//           description="Selamat datang kembali. Ini ringkasan warehouse kamu hari ini."
//         />
//         <Button
//           variant="outline"
//           onClick={handleLogout}
//           className="flex items-center gap-2 shrink-0"
//         >
//           <LogOut className="w-4 h-4" />
//           Logout
//         </Button>
//       </div>

//       {/* Stat Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {stats.map((stat) => (
//           <StatCard
//             key={stat.title}
//             title={stat.title}
//             value={stat.value}
//             description={stat.description}
//             icon={stat.icon}
//           />
//         ))}
//       </div>

//       {/* AI Insight Placeholder */}
//       <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
//         <div className="flex flex-col items-center justify-center py-16 px-4">
//           <Sparkles className="w-12 h-12 text-blue-400 mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             AI Insight Dashboard
//           </h3>
//           <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
//             AI insight akan muncul di sini setelah kamu menambahkan data produk
//             dan gudang.
//           </p>
//           <Link href="/products">
//             <Button>Tambah Produk Pertama</Button>
//           </Link>
//         </div>
//       </Card>
//     </PageContainer>
//   );
// }