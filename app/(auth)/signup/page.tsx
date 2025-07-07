"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { truncate } from "@/lib/utils";
import Link from "next/link";
import { RegisterProvider, useRegisterContext } from "./context";
import { SignUpForm } from "./signup-form";
import { VerifyEmailForm } from "./verify-email-form";

export default function SignupPage() {
  return (
    <RegisterProvider>
      <RegisterFlow />
    </RegisterProvider>
  );
}

function SignUp() {
  return (
    <section className="space-y-4 text-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Create your {process.env.NEXT_PUBLIC_APP_NAME} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Button variant="link" className="p-0 font-medium" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </p>
    </section>
  );
}

function Verify() {
  const { email } = useRegisterContext();

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 px-4 pt-8 pb-6 text-center sm:px-16">
        <h3 className="text-xl font-semibold">Verify your email address</h3>
        <p className="text-sm text-neutral-500">
          Enter the six digit verification code sent to{" "}
          <strong className="font-medium text-neutral-600" title={email}>
            {truncate(email, 30)}
          </strong>
        </p>
      </div>
      <VerifyEmailForm />
      <p className="mt-4 text-center text-sm text-neutral-500">
        Already have an account?&nbsp;
        <Link
          href="/login"
          className="font-semibold text-neutral-500 underline underline-offset-2 transition-colors hover:text-black"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

const RegisterFlow = () => {
  const { step } = useRegisterContext();

  if (step === "signup") return <SignUp />;
  if (step === "verify") return <Verify />;
};
