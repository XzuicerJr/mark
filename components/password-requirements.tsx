import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { memo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const REQUIREMENTS: {
  name: string;
  check: (password: string) => boolean;
}[] = [
  {
    name: "Number",
    check: (p) => /\d/.test(p),
  },
  {
    name: "Uppercase letter",
    check: (p) => /[A-Z]/.test(p),
  },
  {
    name: "Lowercase letter",
    check: (p) => /[a-z]/.test(p),
  },
];

/**
 * Component to display the password requirements and whether they are each met for a password field.
 *
 * Note: This component must be used within a FormProvider context.
 */
export const PasswordRequirements = memo(function PasswordRequirements({
  field = "password",
  className,
}: {
  field?: string;
  className?: string;
}) {
  const {
    formState: { errors },
  } = useFormContext();
  const password = useWatch({ name: field });

  return (
    <ul className={cn("mt-2 flex flex-wrap items-center gap-3", className)}>
      {REQUIREMENTS.map(({ name, check }) => {
        const checked = password?.length && check(password);

        return (
          <li
            key={name}
            className={cn(
              "flex items-center gap-1 text-xs text-neutral-400 transition-colors",
              checked ? "text-green-600" : errors[field] && "text-red-600",
            )}
          >
            <span
              className={cn(
                "flex size-3 items-center justify-center rounded-sm bg-neutral-400 transition-colors",
                checked && "bg-green-600",
                errors[field] && "bg-red-600",
              )}
            >
              <Check
                strokeWidth={4}
                className={cn(
                  "size-2 text-white",
                  checked
                    ? "transition-all duration-150 ease-in-out"
                    : errors[field]
                      ? "text-white"
                      : "text-neutral-400",
                )}
              />
            </span>
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
});
