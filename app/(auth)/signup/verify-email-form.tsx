"use client";

import { useMediaQuery } from "@/components/hooks/use-media-query";
import { AnimatedSizeContainer } from "@/components/ui/animated-size-container";
import { Button } from "@/components/ui/button";
import { createUserAccountAction } from "@/lib/actions/create-user-account";
import { cn } from "@/lib/utils";
import { OTPInput } from "input-otp";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterContext } from "./context";
import { ResendOtp } from "./resend-otp";

export const VerifyEmailForm = () => {
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const [code, setCode] = useState("");
  const { name, email, password } = useRegisterContext();
  const [isInvalidCode, setIsInvalidCode] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { executeAsync, isPending } = useAction(createUserAccountAction, {
    async onSuccess() {
      toast.success("Account created! Redirecting to dashboard...");
      setIsRedirecting(true);

      await signIn("credentials", {
        email,
        password,
      });
    },
    onError({ error }) {
      toast.error(error.serverError);
      setCode("");
      setIsInvalidCode(true);
    },
  });

  if (!email || !password) {
    router.push("/signup");
    return;
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeAsync({ name, email, password, code });
        }}
      >
        <div>
          <OTPInput
            maxLength={6}
            value={code}
            onChange={(code) => {
              setIsInvalidCode(false);
              setCode(code);
            }}
            autoFocus={!isMobile}
            render={({ slots }) => (
              <div className="flex w-full items-center justify-between">
                {slots.map(({ char, isActive, hasFakeCaret }, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "relative flex h-14 w-12 items-center justify-center text-xl",
                      "rounded-lg border border-neutral-200 bg-white ring-0 transition-all",
                      isActive &&
                        "z-10 border border-neutral-800 ring-2 ring-neutral-200",
                      isInvalidCode && "border-red-500 ring-red-200",
                    )}
                  >
                    {char}
                    {hasFakeCaret && (
                      <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-px bg-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            onComplete={() => {
              executeAsync({ name, email, password, code });
            }}
          />
          <AnimatedSizeContainer height>
            {isInvalidCode && (
              <p className="pt-3 text-center text-xs font-medium text-red-500">
                Invalid code. Please try again.
              </p>
            )}
          </AnimatedSizeContainer>

          <Button
            type="submit"
            className="mt-8 w-full"
            disabled={!code || code.length < 6 || isPending || isRedirecting}
          >
            {(isPending || isRedirecting) && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {isPending
              ? "Verifying..."
              : isRedirecting
                ? "Redirecting..."
                : "Continue"}
          </Button>
        </div>
      </form>

      <ResendOtp email={email} />
    </div>
  );
};
