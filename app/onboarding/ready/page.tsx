import { Button } from "@/base/components/Button";
import { ProgressBar } from "@/base/components/ProgressBar";
import { Callout } from "@/base/components/Callout";
import { Logo, Wordmark } from "@/base/components/Logo";
import { getSessionProfile } from "@/base/identity/session";

export default async function ReadyPage() {
  const profile = await getSessionProfile();
  const workspace = profile?.workspaces[0];

  return (
    <div className="min-h-screen bg-canvas px-6">
      <div className="mx-auto max-w-[480px] py-14">
        <div className="mb-8 flex items-center gap-2">
          <Logo size={22} />
          <Wordmark size={14} />
        </div>
        <p className="text-[12.5px] font-medium" style={{ color: "var(--text-tertiary)" }}>
          Step 4 of 4
        </p>
        <div className="my-3">
          <ProgressBar value={100} />
        </div>
        <h1 className="mb-2 text-[28px] font-bold tracking-[-0.4px]">Ready to go</h1>
        <p className="mb-5 text-[14.5px]" style={{ color: "var(--text-secondary)" }}>
          {workspace
            ? `${workspace.name} is set up. Connecting Gmail, Outlook, and calendars is optional and can wait.`
            : "Your account is ready. Connecting Gmail, Outlook, and calendars is optional and can wait."}
        </p>
        <Callout>
          Integrations never block access. You can connect Gmail, Outlook, Google Calendar, and
          Outlook Calendar from Settings later.
        </Callout>
        <div className="mt-6">
          <Button href="/modules/whitbyos" variant="primary" fullWidth>
            Get Started with Whitby
          </Button>
        </div>
      </div>
    </div>
  );
}
