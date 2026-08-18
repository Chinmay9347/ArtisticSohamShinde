import { DashboardLayout } from "@/components/features/dashboard/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
//26/07/2026
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// import { DashboardLayout } from "@/components/features/dashboard/DashboardLayout";

// export default function DashboardRootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ProtectedRoute>
//       <DashboardLayout>
//         {children}
//       </DashboardLayout>
//     </ProtectedRoute>
//   );
// }

//old
// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       {children}
//     </>
//   );
// }