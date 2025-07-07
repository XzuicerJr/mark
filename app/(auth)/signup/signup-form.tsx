"use client";

import { SignUpEmail } from "./signup-email";
import { SignUpOAuth } from "./signup-oauth";

export const SignUpForm = ({
  methods = ["email", "google"],
}: {
  methods?: ("email" | "google")[];
}) => {
  return (
    <div className="flex flex-col gap-3">
      {methods.includes("email") && <SignUpEmail />}
      {methods.length && (
        <div className="my-2 flex flex-shrink items-center justify-center gap-2">
          <div className="grow basis-0 border-b border-neutral-300" />
          <span className="text-xs leading-none font-normal text-neutral-500 uppercase">
            or
          </span>
          <div className="grow basis-0 border-b border-neutral-300" />
        </div>
      )}
      <SignUpOAuth methods={methods} />
    </div>
  );
};
