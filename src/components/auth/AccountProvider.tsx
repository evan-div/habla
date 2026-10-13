"use client";

import { useEffect } from "react";
import { initAccount } from "@/lib/auth/account";

/** Starts the account/sync check once when the app loads. Renders nothing. */
export function AccountProvider() {
  useEffect(() => {
    void initAccount();
  }, []);
  return null;
}
