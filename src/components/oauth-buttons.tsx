import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.6 5.6 0 0 1-2.41 3.63v3h3.9c2.28-2.1 3.53-5.19 3.53-8.87Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.9-3a7.46 7.46 0 0 1-11.1-3.92H.9v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M4.93 14.18a7.2 7.2 0 0 1 0-4.36v-3.1H.9a12 12 0 0 0 0 10.56l4.03-3.1Z" />
    <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 .9 6.72l4.03 3.1A7.16 7.16 0 0 1 12 4.75Z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.27 5.7.42.36.78 1.08.78 2.17v3.22c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
  </svg>
);

export function OAuthButtons({ callbackUrl = "/" }: { callbackUrl?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: callbackUrl });
        }}
      >
        <Button type="submit" variant="outline" className="h-11 w-full">
          <GoogleIcon /> Continue with Google
        </Button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: callbackUrl });
        }}
      >
        <Button type="submit" variant="outline" className="h-11 w-full">
          <GitHubIcon /> Continue with GitHub
        </Button>
      </form>
    </div>
  );
}
