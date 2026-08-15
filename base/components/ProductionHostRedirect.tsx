"use client";

import { useEffect } from "react";
import { PRODUCTION_HOST } from "@/base/auth/site";

export function ProductionHostRedirect() {
  useEffect(() => {
    const { hostname, pathname, search, hash } = window.location;
    if (hostname.endsWith(".vercel.app") && hostname !== PRODUCTION_HOST) {
      window.location.replace(`https://${PRODUCTION_HOST}${pathname}${search}${hash}`);
    }
  }, []);
  return null;
}
