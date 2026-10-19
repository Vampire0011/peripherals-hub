import Link from "next/link";
import { Mouse, Keyboard } from "lucide-react";
import { OAuthButtons } from "@/components/oauth-buttons";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams.callbackUrl || "/";

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-grid-glow px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
            <Mouse className="h-5 w-5 text-primary absolute -translate-x-1 -translate-y-1" />
            <Keyboard className="h-5 w-5 text-accent absolute translate-x-1.5 translate-y-1.5" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to save favorites and track prices</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 glow-border">
          <OAuthButtons callbackUrl={callbackUrl} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have an account? Signing in with Google or GitHub creates one automatically.{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}
