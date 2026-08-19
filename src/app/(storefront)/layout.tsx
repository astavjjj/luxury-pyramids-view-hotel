import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { getDictionary } from "@/lib/i18n/server";
import { getSiteSettings } from "@/services/content.service";
import { getCurrentUser } from "@/services/auth.service";
import { withFallback } from "@/lib/data";

export default async function StorefrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [dict, settings, user] = await Promise.all([
    getDictionary(),
    withFallback(() => getSiteSettings(), {}),
    getCurrentUser().catch(() => null),
  ]);

  return (
    <>
      <Header dict={dict} settings={settings} signedIn={Boolean(user)} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict} settings={settings} />
    </>
  );
}