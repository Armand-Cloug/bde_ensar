// src/components/account/SignOutButton.tsx
'use client';

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

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
      Se déconnecter
    </Button>
  );
}
