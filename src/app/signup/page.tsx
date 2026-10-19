import Link from "next/link";
import { Mouse, Keyboard, Heart, TrendingDown, Bell } from "lucide-react";
import { OAuthButtons } from "@/components/oauth-buttons";

const perks = [
  { icon: Heart, text: "Save unlimited favorites" },
  { icon: TrendingDown, text: "Track historical price drops" },
  { icon: Bell, text: "Get the freshest auto-synced catalog" },
];

export default function SignupPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-grid-glow px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
            <Mouse className="h-5 w-5 text-primary absolute -translate-x-1 -translate-y-1" />
            <Keyboard className="h-5 w-5 text-accent absolute translate-x-1.5 translate-y-1.5" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No passwords needed — just continue with a provider below.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 glow-border">
          <OAuthButtons callbackUrl="/dashboard" />

          <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
            {perks.map((p) => (
              <li key={p.text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <p.icon className="h-4 w-4 text-accent shrink-0" />
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
