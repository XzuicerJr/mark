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
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import ModalDelete from "../modal-delete";
import { Button } from "./button";

interface ModalProps {
  className?: string;
  headerClassName?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: {
    onDelete?: {
      action: MouseEventHandler<HTMLButtonElement>;
      modal: {
        title: string;
        description?: string;
        content: React.ReactNode;
      };
    };
    onSubmit?: {
      action: MouseEventHandler<HTMLButtonElement>;
      text: string;
      variant?: "default" | "destructive";
    };
    onCancel?: {
      action?: MouseEventHandler<HTMLButtonElement>;
      text: string;
    };
  };
  icon?: React.ReactNode;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({
  className,
  headerClassName,
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
            <DrawerHeader
              className={cn("flex-row items-center", headerClassName)}
            >
              {icon && (
                <div className="flex size-12 items-center justify-center">
                  {icon}
                </div>
              )}
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
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
              <div
                className={cn(
                  "grid grid-cols-2 gap-2",
                  !footer.onDelete && "grid-cols-1",
                )}
              >
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
          <DialogHeader
            className={cn("flex-row items-center", headerClassName)}
          >
            {icon && (
              <div className="flex size-12 items-center justify-center">
                {icon}
              </div>
            )}
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
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
              <div className="flex w-full items-center justify-end gap-2">
                {footer.onCancel && (
                  <DialogClose asChild>
                    <Button variant="outline" onClick={footer.onCancel.action}>
                      {footer.onCancel.text}
                    </Button>
                  </DialogClose>
                )}
                {footer.onSubmit && (
                  <Button
                    variant={footer.onSubmit.variant ?? "default"}
                    onClick={footer.onSubmit.action}
                  >
                    {footer.onSubmit.text}
                  </Button>
                )}
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
