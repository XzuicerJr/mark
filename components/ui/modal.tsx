"use client";

import { useMediaQuery } from "@/components/hooks/use-media-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import ModalDelete from "../modal-delete";
import { Button } from "./button";

interface ModalProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: {
    onDelete?: {
      action: () => void;
      modal: {
        title: string;
        description?: string;
        content: React.ReactNode;
      };
    };
    onSubmit?: {
      action: () => void;
      text: string;
      variant?: "default" | "destructive";
    };
    onCancel?: {
      action?: () => void;
      text: string;
    };
  };
  icon?: React.ReactNode;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({
  className,
  children,
  title,
  description,
  footer,
  icon,
  showModal,
  setShowModal,
}: ModalProps) {
  const { device } = useMediaQuery();

  if (device === "mobile") {
    return (
      <Drawer modal open={showModal} onOpenChange={setShowModal}>
        <DrawerContent
          className={className}
          aria-describedby={description ?? "this is a drawer"}
        >
          {(icon || title || description) && (
            <DrawerHeader className="flex-row items-center">
              {icon && (
                <div className="flex size-12 items-center justify-center">
                  {icon}
                </div>
              )}
              <div className="flex flex-col items-start">
                {title && <DrawerTitle>{title}</DrawerTitle>}
                {description && (
                  <DrawerDescription>{description}</DrawerDescription>
                )}
              </div>
            </DrawerHeader>
          )}
          <div className="space-y-4 px-4">{children}</div>
          {(footer?.onSubmit || footer?.onCancel) && (
            <DrawerFooter>
              {footer.onSubmit && (
                <Button
                  variant={footer.onSubmit.variant ?? "default"}
                  onClick={footer.onSubmit.action}
                >
                  {footer.onSubmit.text}
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                {footer.onDelete && (
                  <ModalDelete
                    onDelete={footer.onDelete.action}
                    title={footer.onDelete.modal.title}
                    description={footer.onDelete.modal.description}
                    content={footer.onDelete.modal.content}
                  />
                )}
                {footer.onCancel && (
                  <DrawerClose asChild>
                    <Button variant="outline" onClick={footer.onCancel.action}>
                      {footer.onCancel.text}
                    </Button>
                  </DrawerClose>
                )}
              </div>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog modal open={showModal} onOpenChange={setShowModal}>
      <DialogContent
        className={cn("mx-auto w-full max-w-lg", className)}
        aria-describedby={description ?? "this is a dialog"}
      >
        {(icon || title || description) && (
          <DialogHeader className="flex-row items-center">
            {icon && (
              <div className="flex size-12 items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
          </DialogHeader>
        )}
        {children}
        {(footer?.onSubmit || footer?.onCancel) && (
          <DialogFooter className="flex gap-2 sm:justify-between">
            {footer.onDelete && (
              <ModalDelete
                onDelete={footer.onDelete.action}
                title={footer.onDelete.modal.title}
                description={footer.onDelete.modal.description}
                content={footer.onDelete.modal.content}
              />
            )}
            {(footer.onSubmit || footer.onCancel) && (
              <div className="flex items-center gap-2">
                {footer.onSubmit && (
                  <Button
                    variant={footer.onSubmit.variant ?? "default"}
                    onClick={footer.onSubmit.action}
                  >
                    {footer.onSubmit.text}
                  </Button>
                )}
                {footer.onCancel && (
                  <DialogClose asChild>
                    <Button variant="outline" onClick={footer.onCancel.action}>
                      {footer.onCancel.text}
                    </Button>
                  </DialogClose>
                )}
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
