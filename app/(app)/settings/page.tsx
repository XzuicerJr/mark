"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientOnly } from "@/components/ui/client-only";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaxWithContainer } from "@/components/ui/max-with-container";
import { cn } from "@/lib/utils";
import z from "@/lib/zod";
import { accountUpdateSchema } from "@/lib/zod/schema/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DeleteAccountModal from "./delete-account-modal";

export default function Settings() {
  const { data: session, update, status } = useSession();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const accountForm = useForm<z.infer<typeof accountUpdateSchema>>({
    resolver: zodResolver(accountUpdateSchema),
    values: {
      name: status === "loading" ? "" : (session?.user?.name ?? ""),
    },
  });

  const handleAccountUpdate = async (
    data: z.infer<typeof accountUpdateSchema>,
  ) => {
    await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        update({ user: { name: data.name } });
        toast.success("Successfully updated your name!");
      } else {
        const { error } = await res.json();
        toast.error(error.message);
      }
    });
  };

  return (
    <ClientOnly className="pt-4">
      <MaxWithContainer className="space-y-4">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <div className="col-span-2 grid">
            <h2 className="text-lg font-medium">Account</h2>
          </div>
          <Card className="col-span-4 pb-3">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account information.
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={accountForm.handleSubmit(handleAccountUpdate)}
              className="space-y-6"
            >
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input
                    {...accountForm.register("name", {
                      required: "Name is required",
                    })}
                    error={accountForm.formState.errors.name?.message}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="john.doe@example.com"
                    value={session?.user?.email ?? ""}
                    readOnly
                    disabled
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t !pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => accountForm.reset()}
                  disabled={!accountForm.formState.isDirty}
                  className={cn(
                    "transition-all duration-300 disabled:opacity-0",
                    accountForm.formState.isDirty && "opacity-100",
                  )}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={accountForm.handleSubmit(handleAccountUpdate)}
                  disabled={!accountForm.formState.isDirty}
                >
                  Save
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <div className="col-span-2 grid">
            <h2 className="text-lg font-medium">System</h2>
          </div>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>User ID</CardTitle>
              <CardDescription>
                This is your unique identifier on{" "}
                {process.env.NEXT_PUBLIC_APP_NAME}.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Input
                readOnly
                value={session?.user?.id ?? ""}
                suffix={<CopyButton value={session?.user?.id ?? ""} />}
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <div className="col-span-2 grid">
            <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
          </div>
          <Card className="col-span-4 border-red-500 pb-3">
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Deleting your account will permanently remove all your data from{" "}
                {process.env.NEXT_PUBLIC_APP_NAME}.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end border-t border-red-500 !pt-3">
              <DeleteAccountModal
                showDeleteAccountModal={showDeleteAccountModal}
                setShowDeleteAccountModal={setShowDeleteAccountModal}
              />
              <Button
                variant="destructive"
                onClick={() => setShowDeleteAccountModal(true)}
              >
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </section>
      </MaxWithContainer>
    </ClientOnly>
  );
}
