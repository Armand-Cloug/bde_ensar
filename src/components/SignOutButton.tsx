'use client';

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignOutButton() {
  return (
    <Button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: "/sign-in",
        })
      }
      variant="destructive"
    >
      Sign Out
    </Button>
  );
}
