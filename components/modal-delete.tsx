"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { TrashIcon } from "lucide-react";
import { MouseEventHandler, useState } from "react";

export default function ModalDelete({
  onDelete,
  title,
  description,
  content,
  small = false,
  button = {
    text: "Delete",
    variant: "outline-destructive",
    hideIcon: false,
  },
}: {
  onDelete: MouseEventHandler<HTMLButtonElement>;
  title: string;
  description?: string;
  content: React.ReactNode;
  small?: boolean;
  button?: {
    text?: string;
    variant?: "outline-destructive" | "destructive";
    hideIcon?: boolean;
  };
}) {
  const [showModal, setShowModal] = useState(false);

  const ButtonComponent = small ? (
    <Button
      variant={button.variant}
      size="icon"
      onClick={() => setShowModal(true)}
    >
      <TrashIcon className="size-4" />
    </Button>
  ) : (
    <Button variant={button.variant} onClick={() => setShowModal(true)}>
      {!button.hideIcon && <TrashIcon className="size-4" />}
      {button.text}
    </Button>
  );

  return (
    <>
      {ButtonComponent}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={title}
        description={description}
        footer={{
          onSubmit: {
            action: (e) => {
              onDelete(e);
              setShowModal(false);
            },
            variant: "destructive",
            text: "Delete",
          },
          onCancel: {
            text: "Cancel",
          },
        }}
      >
        {content}
      </Modal>
    </>
  );
}
