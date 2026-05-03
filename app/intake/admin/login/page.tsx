import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthed()) redirect("/intake/admin");
  return (
    <div className="min-h-screen bg-cream-200 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-3xl border border-ink-900/10 bg-cream/95 px-8 py-10 shadow-[0_30px_80px_-30px_rgba(20,20,20,0.25)]">
        <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
          Futures Church · Campus intake
        </p>
        <h1 className="mt-3 font-display text-display-md text-ink-900 leading-tight">
          Admin sign-in
        </h1>
        <p className="mt-3 font-sans text-body text-ink-600">
          The one place we&rsquo;re tracking every campus&rsquo;s answers as they roll in.
        </p>
        <LoginForm />
        <Link
          href="/"
          className="mt-8 inline-block font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
        >
          ← Back to futures.church
        </Link>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};
