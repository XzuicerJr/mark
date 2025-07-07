"use client";

import { useMediaQuery } from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkAccountExistsAction } from "@/lib/actions/check-account-exists";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { errorCodes, LoginFormContext } from "./login-form";

export const EmailSignIn = ({ next }: { next?: string }) => {
  const searchParams = useSearchParams();
  const finalNext = next ?? searchParams?.get("next");
  const { isMobile } = useMediaQuery();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    setClickedMethod,
    authMethod,
    setAuthMethod,
    clickedMethod,
    setLastUsedAuthMethod,
    showPasswordField,
    setShowPasswordField,
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

        if (!showPasswordField) {
          const result = await executeAsync({ email });

          if (!result?.data) {
            return;
          }

          const { accountExists, hasPassword } = result.data;

          if (accountExists && hasPassword) {
            setShowPasswordField(true);
            return;
          }

          if (!accountExists) {
            setClickedMethod(undefined);
            toast.error("No account found with that email address.");
            return;
          }
        }

        setClickedMethod("resend");

        const result = await executeAsync({ email });

        if (!result?.data) {
          return;
        }

        const { accountExists, hasPassword } = result.data;

        if (!accountExists) {
          setClickedMethod(undefined);
          toast.error("No account found with that email address.");
          return;
        }

        const provider = password && hasPassword ? "credentials" : "resend";

        const response = await signIn(provider, {
          email,
          redirect: false,
          callbackUrl: finalNext || "/",
          ...(password && { password }),
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

        // same as "credentials" if password is provided
        // this is only needed to show the correct last used auth method in the UI
        setLastUsedAuthMethod("resend");

        if (provider === "resend") {
          toast.success("Email sent - check your inbox!");
          setEmail("");
          setClickedMethod(undefined);
          return;
        }

        if (provider === "credentials") {
          toast.success("Logged in!");
          setEmail("");
          setPassword("");
          router.push(response?.url || finalNext || "/");
          return;
        }
      }}
      className="flex flex-col gap-y-3"
    >
      {authMethod === "resend" && (
        <Input
          id="email"
          name="email"
          autoFocus={!isMobile && !showPasswordField}
          type="email"
          placeholder="john@doe.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={isPending ? "pr-10" : undefined}
          size={1}
        />
      )}

      {showPasswordField && (
        <Input
          type="password"
          autoFocus={!isMobile}
          value={password}
          placeholder="Password (optional)"
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      <Button
        className="w-full"
        {...(authMethod !== "resend" && {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            setAuthMethod("resend");
          },
        })}
        disabled={clickedMethod && clickedMethod !== "resend"}
      >
        {(clickedMethod === "resend" || isPending) && (
          <Loader2 className="size-4 animate-spin" />
        )}
        Login with {password ? "password" : "email"}
      </Button>
    </form>
  );
};
