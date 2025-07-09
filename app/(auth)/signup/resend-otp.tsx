"use client";

import { sendOtpAction } from "@/lib/actions/send-otp";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

export const ResendOtp = ({ email }: { email: string }) => {
  const [delaySeconds, setDelaySeconds] = useState(0);
  const [state, setState] = useState<"default" | "success" | "error">(
    "default",
  );

  const { executeAsync, isPending } = useAction(sendOtpAction, {
    onSuccess: () => setState("success"),
    onError: () => setState("error"),
  });

  useEffect(() => {
    if (state === "success") {
      setDelaySeconds(60);
    } else if (state === "error") {
      setDelaySeconds(5);
    }
  }, [state]);

  useEffect(() => {
    if (delaySeconds > 0) {
      const interval = setInterval(
        () => setDelaySeconds(delaySeconds - 1),
        1000,
      );

      return () => clearInterval(interval);
    } else {
      setState("default");
    }
  }, [delaySeconds]);

  return (
    <div className="relative mt-4 text-center text-sm text-neutral-500">
      {state === "default" && (
        <p className={cn(isPending && "opacity-80")}>
          Didn&apos;t receive a code?{" "}
          <button
            onClick={() => executeAsync({ email })}
            className={cn(
              "font-semibold text-neutral-500 underline underline-offset-2 transition-colors hover:text-black",
              isPending && "pointer-events-none",
            )}
          >
            {isPending && <Loader2 className="size-3 animate-spin" />}
            {isPending ? "Sending..." : "Resend"}
          </button>
        </p>
      )}

      {state === "success" && (
        <p className="text-sm text-neutral-500">
          Code sent successfully. <Delay seconds={delaySeconds} />
        </p>
      )}

      {state === "error" && (
        <p className="text-sm text-neutral-500">
          Failed to send code. <Delay seconds={delaySeconds} />
        </p>
      )}
    </div>
  );
};

const Delay = ({ seconds }: { seconds: number }) => {
  return (
    <span className="ml-1 text-sm text-neutral-400 tabular-nums">
      {seconds}s
    </span>
  );
};
