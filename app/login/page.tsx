import { AuthLayout } from "@/base/components/AuthLayout";
import { LoginForm } from "@/base/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string; brand?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next || "/switcher";
  const eyebrow =
    params.brand === "partner"
      ? "Private Attaché / Partner Center"
      : params.brand === "portal"
        ? "Client Portal"
        : "Private Attaché";

  return (
    <AuthLayout eyebrow={eyebrow} title="Sign in">
      {params.notice === "check-email" ? (
        <p className="mb-4 text-[13.5px]" style={{ color: "var(--text-secondary)" }}>
          Check your email to confirm the account, then sign in.
        </p>
      ) : null}
      <LoginForm nextPath={nextPath} />
    </AuthLayout>
  );
}
