"use client";
import { cn } from "@/lib/utils";
import { Check, Copy, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";

export function CopyButton({
  value,
  className,
  icon,
  successMessage,
}: {
  value: string;
  className?: string;
  icon?: LucideIcon;
  successMessage?: string;
}) {
  const [copied, copyToClipboard] = useCopyToClipboard();
  const Comp = icon || Copy;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toast.promise(copyToClipboard(value), {
          success: successMessage || "Copied to clipboard!",
        });
      }}
      className={cn(
        "group relative rounded-full bg-transparent p-1.5 transition-all duration-75 hover:bg-neutral-100 active:bg-neutral-200",
        className,
      )}
      type="button"
    >
      <span className="sr-only">Copy</span>
      {copied ? <Check className="size-3.5" /> : <Comp className="size-3.5" />}
    </button>
  );
}
