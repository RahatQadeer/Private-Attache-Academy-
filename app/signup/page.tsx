import { AuthLayout } from "@/base/components/AuthLayout";
import { EmailOtpForm } from "@/base/auth/EmailOtpForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; brand?: string }>;
}) {
  const params = await searchParams;
  const eyebrow =
    params.brand === "partner"
      ? "Private Attaché / Partner Center"
      : "Private Attaché";

  return (
    <AuthLayout eyebrow={eyebrow} title="Create your account">
      <EmailOtpForm mode="signup" nextPath={params.next || "/switcher"} />
    </AuthLayout>
  );
}
