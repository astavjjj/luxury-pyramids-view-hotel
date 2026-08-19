import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/services/auth.service";
import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function AdminLoginPage() {
  const staff = await getCurrentStaff().catch(() => null);
  if (staff) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16 text-white">
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-4">Hotel Management</p>
        <h1 className="font-display text-4xl">Admin</h1>
        <p className="mt-2 text-sm text-white/60">Restricted access.</p>
        <div className="mt-10">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-xs text-white/40">
          Demo credentials: admin@example.com / ChangeMe123!
        </p>
      </div>
    </main>
  );
}