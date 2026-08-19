import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, DoorOpen, CalendarDays } from "lucide-react";
import { getCurrentStaff } from "@/services/auth.service";
import { AdminSignOut } from "@/components/admin/sign-out";

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const staff = await getCurrentStaff().catch(() => null);
  if (!staff) redirect("/admin/login");

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/rooms", label: "Rooms", icon: DoorOpen },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  ];

  return (
    <main className="min-h-screen bg-sand-deep">
      <div className="flex min-h-screen">
        <aside className="flex w-60 flex-col border-r border-line bg-ink px-5 py-8 text-white">
          <p className="font-display text-xl">Pyramids View</p>
          <p className="mt-1 text-xs text-white/50">{staff.role}</p>

          <nav className="mt-10 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <AdminSignOut />
          </div>
        </aside>

        <div className="flex-1 p-8 md:p-12">{children}</div>
      </div>
    </main>
  );
}