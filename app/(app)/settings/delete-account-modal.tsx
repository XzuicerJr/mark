"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export default function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [deleting, setDeleting] = useState(false);

  async function deleteAccount() {
    setDeleting(true);
    await fetch(`/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 200) {
        update({});

        // delay to allow for the route change to complete
        await new Promise((resolve) =>
          setTimeout(() => {
            router.push("/signup");
            resolve(null);
          }, 200),
        );
      } else {
        setDeleting(false);
        const error = await res.text();
        throw error;
      }
    });
  }

  return (
    <Modal
      showModal={showDeleteAccountModal}
      setShowModal={setShowDeleteAccountModal}
      title="Delete Account"
      description="Warning: This will permanently delete your account and all your data."
      icon={
        session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ""}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Skeleton className="size-10 rounded-full" />
        )
      }
      className="pb-4"
      headerClassName="flex-col gap-2 items-start md:items-center justify-center text-left md:text-center md:px-16 pb-4 border-b"
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteAccount(), {
            loading: "Deleting account...",
            success: "Account deleted successfully!",
            error: (err) => err,
          });
        }}
        className="mt-4 mb-0 flex flex-col gap-4 text-left md:mt-0"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="verification" className="block text-sm">
            To verify, type{" "}
            <span className="font-bold">confirm delete account</span> below
          </Label>
          <Input
            type="text"
            name="verification"
            id="verification"
            pattern="confirm delete account"
            required
            autoFocus={false}
            autoComplete="off"
            className="w-full max-w-none"
            containerClassName="max-w-none"
          />
        </div>

        <Button variant="destructive" disabled={deleting}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Confirm Delete Account
        </Button>
      </form>
    </Modal>
  );
}
