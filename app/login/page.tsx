import { AuthLayout } from "@/base/components/AuthLayout";
import { EmailOtpForm } from "@/base/auth/EmailOtpForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string; brand?: string; error?: string }>;
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
      {params.error ? (
        <p className="mb-4 text-[13.5px]" style={{ color: "var(--danger-fg)" }}>
          {params.error}
        </p>
      ) : null}
      <EmailOtpForm mode="login" nextPath={nextPath} />
    </AuthLayout>
  );
}
