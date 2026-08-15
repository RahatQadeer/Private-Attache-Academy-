import { AuthLayout } from "@/base/components/AuthLayout";
import { SignupForm } from "@/base/auth/SignupForm";

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
      <SignupForm nextPath={params.next || "/onboarding/workspace"} />
    </AuthLayout>
  );
}
