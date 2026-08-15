import { AuthLayout } from "@/base/components/AuthLayout";
import { ResetPasswordForm } from "@/base/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout eyebrow="Private Attaché" title="Choose a new password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
