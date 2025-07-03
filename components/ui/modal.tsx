"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerDescription,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/components/hooks/use-media-query";
import { Button } from "./button";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: {
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
              {footer.onCancel && (
                <DrawerClose asChild>
                  <Button variant="outline" onClick={footer.onCancel.action}>
                    {footer.onCancel.text}
                  </Button>
                </DrawerClose>
              )}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog modal open={showModal} onOpenChange={setShowModal}>
      <DialogContent className={cn(className, "max-w-lg mx-auto w-full")}>
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
          <DialogFooter>
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
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
