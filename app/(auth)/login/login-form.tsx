"use client";

import { useLocalStorage } from "@/components/hooks/use-local-storage";
import { AnimatedSizeContainer } from "@/components/ui/animated-size-container";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  ComponentType,
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { EmailSignIn } from "./email-sign-in";
import { GoogleButton } from "./google-button";

export const authMethods = ["google", "resend"] as const;

export type AuthMethod = (typeof authMethods)[number];

export const errorCodes = {
  "no-credentials": "Please provide an email and password.",
  "invalid-credentials": "Email or password is incorrect.",
  "exceeded-login-attempts":
    "Account has been locked due to too many login attempts. Please contact support to unlock your account.",
  "too-many-login-attempts": "Too many login attempts. Please try again later.",
  "email-not-verified": "Please verify your email address.",
  Callback:
    "We encountered an issue processing your request. Please try again or contact support if the problem persists.",
  OAuthSignin:
    "There was an issue signing you in. Please ensure your provider settings are correct.",
  OAuthCallback:
    "We faced a problem while processing the response from the OAuth provider. Please try again.",
};

export const LoginFormContext = createContext<{
  authMethod: AuthMethod | undefined;
  setAuthMethod: Dispatch<SetStateAction<AuthMethod | undefined>>;
  clickedMethod: AuthMethod | undefined;
  showPasswordField: boolean;
  setShowPasswordField: Dispatch<SetStateAction<boolean>>;
  setClickedMethod: Dispatch<SetStateAction<AuthMethod | undefined>>;
  setLastUsedAuthMethod: (method: AuthMethod | undefined) => void;
}>({
  authMethod: undefined,
  setAuthMethod: () => {},
  clickedMethod: undefined,
  showPasswordField: false,
  setShowPasswordField: () => {},
  setClickedMethod: () => {},
  setLastUsedAuthMethod: () => {},
});

export default function LoginForm({
  methods = [...authMethods],
  next,
}: {
  methods?: AuthMethod[];
  next?: string;
}) {
  const searchParams = useSearchParams();
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [clickedMethod, setClickedMethod] = useState<AuthMethod | undefined>(
    undefined,
  );

  const [lastUsedAuthMethodLive, setLastUsedAuthMethod] = useLocalStorage<
    AuthMethod | undefined
  >("last-used-auth-method", undefined);
  const { current: lastUsedAuthMethod } = useRef<AuthMethod | undefined>(
    lastUsedAuthMethodLive,
  );

  const [authMethod, setAuthMethod] = useState<AuthMethod | undefined>(
    authMethods.find((m) => m === lastUsedAuthMethodLive) ?? "resend",
  );

  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      toast.error(
        errorCodes[error as keyof typeof errorCodes] ||
          "An unexpected error occurred. Please try again later.",
      );
    }
  }, [searchParams]);

  // Reset the state when leaving the page
  useEffect(() => () => setClickedMethod(undefined), []);

  const authProviders: {
    method: AuthMethod;
    component: ComponentType;
    props?: Record<string, unknown>;
  }[] = [
    {
      method: "google",
      component: GoogleButton,
      props: { next },
    },
    {
      method: "resend",
      component: EmailSignIn,
      props: { next },
    },
  ];

  const currentAuthProvider = authProviders.find(
    (provider) => provider.method === authMethod,
  );

  const AuthMethodComponent = currentAuthProvider?.component;
  const showEmailPasswordOnly = authMethod === "resend" && showPasswordField;

  return (
    <LoginFormContext.Provider
      value={{
        authMethod,
        setAuthMethod,
        clickedMethod,
        setClickedMethod,
        setLastUsedAuthMethod,
        showPasswordField,
        setShowPasswordField,
      }}
    >
      <div className="flex flex-col gap-3">
        <AnimatedSizeContainer height>
          <div className="flex flex-col gap-3 p-1">
            {authMethod && (
              <div className="flex flex-col gap-2">
                {AuthMethodComponent && (
                  <AuthMethodComponent {...currentAuthProvider?.props} />
                )}

                {!showEmailPasswordOnly &&
                  authMethod === lastUsedAuthMethod && (
                    <div className="text-center text-xs">
                      <span className="text-neutral-500">
                        You signed in with{" "}
                        {lastUsedAuthMethod === "resend"
                          ? "Email "
                          : lastUsedAuthMethod.charAt(0).toUpperCase() +
                            lastUsedAuthMethod.slice(1) +
                            " "}
                        last time
                      </span>
                    </div>
                  )}
                <div className="my-2 flex flex-shrink items-center justify-center gap-2">
                  <div className="grow basis-0 border-b border-neutral-300" />
                  <span className="text-xs leading-none font-normal text-neutral-500 uppercase">
                    or
                  </span>
                  <div className="grow basis-0 border-b border-neutral-300" />
                </div>
              </div>
            )}

            {showEmailPasswordOnly ? (
              <div className="mt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordField(false)}
                  className="w-full"
                >
                  Continue with another method
                </Button>
              </div>
            ) : (
              authProviders
                .filter(
                  (provider) =>
                    provider.method !== authMethod &&
                    methods.includes(provider.method),
                )
                .map((provider) => (
                  <div key={provider.method}>
                    <provider.component />
                  </div>
                ))
            )}
          </div>
        </AnimatedSizeContainer>
      </div>
    </LoginFormContext.Provider>
  );
}
