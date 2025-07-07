"use client";

import { useMediaQuery } from "@/components/hooks/use-media-query";
import { PasswordRequirements } from "@/components/password-requirements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendOtpAction } from "@/lib/actions/send-otp";
import z from "@/lib/zod";
import { signUpSchema } from "@/lib/zod/schema/auth";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { FormEvent, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegisterContext } from "./context";

type SignUpProps = z.infer<typeof signUpSchema>;

export const SignUpEmail = () => {
  const { isMobile } = useMediaQuery();

  const { setName, setStep, setEmail, setPassword, email, lockEmail } =
    useRegisterContext();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpProps>({
    defaultValues: {
      email,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = form;

  const { executeAsync, isPending } = useAction(sendOtpAction, {
    onSuccess: () => {
      setName(getValues("name"));
      setEmail(getValues("email"));
      setPassword(getValues("password"));
      setStep("verify");
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError ||
          error.validationErrors?.email?._errors?.[0] ||
          error.validationErrors?.password?._errors?.[0],
      );
    },
  });

  const onSubmit = useCallback(
    (e: FormEvent) => {
      const { name, email, password } = getValues();

      if (name && email && !password && !showPassword) {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword(true);
        return;
      }

      handleSubmit(async (data) => await executeAsync(data))(e);
    },
    [getValues, showPassword, handleSubmit, executeAsync],
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-6">
        <label>
          <span className="text-content-emphasis mb-2 block text-start text-sm leading-none font-medium">
            Name
          </span>
          <Input
            placeholder="John Doe"
            required
            {...register("name")}
            autoFocus={!isMobile && !showPassword && !lockEmail}
            error={errors.email?.message}
          />
        </label>
        <label>
          <span className="text-content-emphasis mb-2 block text-start text-sm leading-none font-medium">
            Email
          </span>
          <Input
            type="email"
            placeholder="john@doe.com"
            autoComplete="email"
            required
            readOnly={!errors.email && lockEmail}
            autoFocus={!isMobile && !showPassword && !lockEmail}
            {...register("email")}
            error={errors.email?.message}
          />
        </label>
        {showPassword && (
          <label>
            <span className="text-content-emphasis mb-2 block text-start text-sm leading-none font-medium">
              Password
            </span>
            <Input
              type="password"
              required
              autoFocus={!isMobile}
              {...register("password")}
              error={errors.password?.message}
              minLength={8}
            />
            <FormProvider {...form}>
              <PasswordRequirements />
            </FormProvider>
          </label>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? "Submitting..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
};
