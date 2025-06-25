"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1>Habit Tracker</h1>
      <Button
        variant="outline"
        onClick={() =>
          signOut({
            redirectTo: "/login",
          })
        }
      >
        Logout
      </Button>
    </div>
  );
}
