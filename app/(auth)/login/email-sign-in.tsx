"use client";

import { useMediaQuery } from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { checkAccountExistsAction } from "@/lib/actions/check-account-exists";
import { cn } from "@/lib/utils";
import { Loader2, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { errorCodes, LoginFormContext } from "./login-form";

export const EmailSignIn = ({ next }: { next?: string }) => {
  const searchParams = useSearchParams();
  const finalNext = next ?? searchParams?.get("next");
  const { isMobile } = useMediaQuery();
  const [email, setEmail] = useState("");

  const {
    setClickedMethod,
    authMethod,
    setAuthMethod,
    clickedMethod,
    setLastUsedAuthMethod,
  } = useContext(LoginFormContext);

  const { executeAsync, isPending } = useAction(checkAccountExistsAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setClickedMethod("resend");

        const result = await executeAsync({ email });

        if (!result?.data) {
          return;
        }

        const { accountExists } = result.data;

        if (!accountExists) {
          setClickedMethod(undefined);
          toast.error("No account found with that email address.");
          return;
        }

        const provider = "resend";

        const response = await signIn(provider, {
          email,
          redirect: false,
          callbackUrl: finalNext || "/",
        });

        if (!response) {
          return;
        }

        if (!response.ok && response.error) {
          if (errorCodes[response.error as keyof typeof errorCodes]) {
            toast.error(errorCodes[response.error as keyof typeof errorCodes]);
          } else {
            toast.error(response.error);
          }

          setClickedMethod(undefined);
          return;
        }

        setLastUsedAuthMethod("resend");

        if (provider === "resend") {
          toast.success("Email sent - check your inbox!");
          setEmail("");
          setClickedMethod(undefined);
          return;
        }
      }}
      className="flex flex-col gap-y-3"
    >
      {authMethod === "resend" && (
        <input
          id="email"
          name="email"
          autoFocus={!isMobile}
          type="email"
          placeholder="panic@thedis.co"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size={1}
          className={cn(
            "block w-full min-w-0 appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-black focus:ring-black focus:outline-none sm:text-sm",
            {
              "pr-10": isPending,
            },
          )}
        />
      )}

      <Button
        variant="outline"
        {...(authMethod !== "resend" && {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            setAuthMethod("resend");
          },
        })}
        disabled={clickedMethod && clickedMethod !== "resend"}
      >
        {clickedMethod === "resend" || isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Mail className="size-4 text-neutral-600" />
        )}
        Continue with Email
      </Button>
    </form>
  );
};
