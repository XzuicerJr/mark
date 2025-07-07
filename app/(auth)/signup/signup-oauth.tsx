"use client";

import { Google } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SignUpOAuth = ({
  methods,
}: {
  methods: ("email" | "google")[];
}) => {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [clickedGoogle, setClickedGoogle] = useState(false);

  useEffect(() => {
    // when leave page, reset state
    return () => {
      setClickedGoogle(false);
    };
  }, []);

  return (
    methods.includes("google") && (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setClickedGoogle(true);
          signIn("google", {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        disabled={clickedGoogle}
      >
        {clickedGoogle ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Google className="size-4" />
        )}
        Continue with Google
      </Button>
    )
  );
};
