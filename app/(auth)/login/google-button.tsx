import { Google } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { LoginFormContext } from "./login-form";

export function GoogleButton({ next }: { next?: string }) {
  const searchParams = useSearchParams();
  const finalNext = next ?? searchParams?.get("next");

  const { setClickedMethod, clickedMethod, setLastUsedAuthMethod } =
    useContext(LoginFormContext);

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        setClickedMethod("google");
        setLastUsedAuthMethod("google");
        signIn("google", {
          ...(finalNext && finalNext.length > 0
            ? { callbackUrl: finalNext }
            : {}),
        });
      }}
      disabled={clickedMethod && clickedMethod !== "google"}
    >
      {clickedMethod === "google" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Google className="size-4" />
      )}
      Continue with Google
    </Button>
  );
}
