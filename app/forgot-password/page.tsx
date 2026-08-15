import { AuthLayout } from "@/base/components/AuthLayout";
import { ForgotPasswordForm } from "@/base/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout eyebrow="Private Attaché" title="Reset your password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
