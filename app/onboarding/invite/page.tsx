"use client";

import { Input } from "@/base/components/Input";
import { Button } from "@/base/components/Button";
import { ProgressBar } from "@/base/components/ProgressBar";
import { Logo, Wordmark } from "@/base/components/Logo";

export default function InviteTeamPage() {
  return (
    <div className="min-h-screen bg-canvas px-6">
      <div className="mx-auto max-w-[440px] py-14">
        <div className="mb-8 flex items-center gap-2">
          <Logo size={22} />
          <Wordmark size={14} />
        </div>
        <p className="text-[12.5px] font-medium" style={{ color: "var(--text-tertiary)" }}>
          Step 3 of 4
        </p>
        <div className="my-3">
          <ProgressBar value={75} />
        </div>
        <h1 className="mb-2 text-[28px] font-bold tracking-[-0.4px]">Invite your team</h1>
        <p className="mb-5 text-[14.5px]" style={{ color: "var(--text-secondary)" }}>
          Optional. Role and permission detail lives in People & Access after you enter Whitby.
        </p>
        <form className="space-y-4" action="/onboarding/ready">
          <Input label="Email Address" name="email" type="email" />
          <label className="block">
            <span
              className="mb-1.5 block text-[12.5px] font-medium uppercase tracking-[0.05em]"
              style={{ color: "var(--text-tertiary)" }}
            >
              Initial role
            </span>
            <select
              name="role"
              className="w-full rounded-control border border-line-strong bg-surface px-3 py-[9px] text-[14.5px]"
              defaultValue="coordinator"
            >
              <option value="admin">Admin</option>
              <option value="team_lead">Team Lead</option>
              <option value="coordinator">Coordinator</option>
              <option value="billing">Billing</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>
          <Button type="submit" variant="primary" fullWidth>
            Continue
          </Button>
          <a href="/onboarding/ready" className="block text-center text-[13.5px]">
            Skip for now
          </a>
        </form>
      </div>
    </div>
  );
}
