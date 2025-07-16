"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeClosed } from "lucide-react";
import React, { useCallback, useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hidePasswordToggle?: boolean;
  suffix?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      hidePasswordToggle,
      suffix,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible(!isPasswordVisible),
      [isPasswordVisible, setIsPasswordVisible],
    );

    return (
      <div>
        <div
          className={cn("relative flex w-full max-w-md", containerClassName)}
        >
          <input
            type={isPasswordVisible ? "text" : type}
            className={cn(
              "focus:border-foreground focus:ring-foreground block w-full min-w-0 appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:outline-none sm:text-sm",
              "max-w-md read-only:bg-neutral-900/5 disabled:cursor-not-allowed dark:read-only:bg-neutral-100/10",
              props.error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            ref={ref}
            {...props}
          />

          <div className="group">
            {props.error && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-none items-center px-2.5">
                <AlertCircle
                  className={cn(
                    "size-5 text-white",
                    type === "password" &&
                      "transition-opacity group-hover:opacity-0",
                  )}
                  fill="#ef4444"
                />
              </div>
            )}
            {type === "password" && (
              <button
                className={cn(
                  "absolute inset-y-0 right-0 flex items-center px-3",
                  props.error &&
                    "opacity-0 transition-opacity group-hover:opacity-100",
                )}
                type="button"
                onClick={() => toggleIsPasswordVisible()}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show Password"
                }
              >
                {isPasswordVisible ? (
                  <Eye
                    className="size-4 flex-none text-neutral-500 transition hover:text-neutral-700"
                    aria-hidden
                  />
                ) : (
                  <EyeClosed
                    className="size-4 flex-none text-neutral-500 transition hover:text-neutral-700"
                    aria-hidden
                  />
                )}
              </button>
            )}
            {!props.error &&
              type !== "password" &&
              !hidePasswordToggle &&
              suffix && (
                <div className="absolute inset-y-0 right-0 flex items-center justify-center px-3">
                  {suffix}
                </div>
              )}
          </div>
        </div>

        {props.error && (
          <span
            className="mt-2 block text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {props.error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
