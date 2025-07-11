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
import { Button } from "./button";

interface ModalProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: {
    onDelete?: {
      action: () => void;
      text: string;
    };
    onSubmit?: {
      action: () => void;
      text: string;
    };
    onCancel?: {
      action?: () => void;
      text: string;
    };
  };
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({
  className,
  children,
  title,
  description,
  footer,
  showModal,
  setShowModal,
}: ModalProps) {
  const { device } = useMediaQuery();

  if (device === "mobile") {
    return (
      <Drawer modal open={showModal} onOpenChange={setShowModal}>
        <DrawerContent className={className}>
          {(title || description) && (
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}
          <div className="px-4">{children}</div>
          {(footer?.onSubmit || footer?.onCancel) && (
            <DrawerFooter>
              {footer.onSubmit && (
                <Button onClick={footer.onSubmit.action}>
                  {footer.onSubmit.text}
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                {footer.onDelete && (
                  <Button
                    variant="outline-destructive"
                    onClick={footer.onDelete.action}
                  >
                    {footer.onDelete.text}
                  </Button>
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
      <DialogContent className={cn(className, "mx-auto w-full max-w-lg")}>
        {(title || description) && (
          <DialogHeader>
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
              <Button
                variant="outline-destructive"
                onClick={footer.onDelete.action}
              >
                {footer.onDelete.text}
              </Button>
            )}
            {(footer.onSubmit || footer.onCancel) && (
              <div className="flex items-center gap-2">
                {footer.onSubmit && (
                  <Button onClick={footer.onSubmit.action}>
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
