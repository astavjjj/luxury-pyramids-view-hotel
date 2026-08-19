import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Eyebrow } from "@/components/ui/section";
import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/services/auth.service";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  const user = await getCurrentUser().catch(() => null);
  if (user) redirect("/account");

  return (
    <section className="pt-32 pb-28 md:pt-40">
      <Container className="max-w-md">
        <Eyebrow>Account</Eyebrow>
        <h1 className="font-display text-4xl md:text-5xl">Create account</h1>
        <p className="mt-3 text-muted">Save your details for faster reservations.</p>
        <div className="mt-10">
          <AuthForm mode="register" />
        </div>
        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-bronze underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </Container>
    </section>
  );
}