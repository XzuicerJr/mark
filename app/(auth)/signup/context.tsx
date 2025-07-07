"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

interface RegisterContextType {
  name: string;
  email: string;
  password: string;
  step: "signup" | "verify";
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setStep: (step: "signup" | "verify") => void;
  lockEmail?: boolean;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined,
);

export const RegisterProvider: React.FC<
  PropsWithChildren<{ email?: string; lockEmail?: boolean }>
> = ({ email: emailProp, lockEmail, children }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailProp ?? "");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"signup" | "verify">("signup");

  return (
    <RegisterContext.Provider
      value={{
        name,
        email,
        password,
        step,
        setName,
        setEmail,
        setPassword,
        setStep,
        lockEmail,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegisterContext = () => {
  const context = useContext(RegisterContext);

  if (context === undefined) {
    throw new Error(
      "useRegisterContext must be used within a RegisterProvider",
    );
  }

  return context;
};
