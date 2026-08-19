"use client";

import Link from "next/link";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-sand px-6">
        <div className="text-center">
          <p className="eyebrow mb-4">Error</p>
          <h1 className="font-display text-5xl">Something went wrong</h1>
          <p className="mt-4 text-muted">{error.message}</p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/" className="btn-lux btn-lux-solid">
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}