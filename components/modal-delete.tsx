"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

export default function ModalDelete({
  onDelete,
  title,
  description,
  content,
  small = false,
}: {
  onDelete: () => void;
  title: string;
  description?: string;
  content: React.ReactNode;
  small?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);

  const ButtonComponent = small ? (
    <Button
      variant="outline-destructive"
      size="icon"
      onClick={() => setShowModal(true)}
    >
      <TrashIcon className="size-4" />
    </Button>
  ) : (
    <Button variant="outline-destructive" onClick={() => setShowModal(true)}>
      <TrashIcon className="size-4" />
      Delete Habit
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
            action: onDelete,
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
