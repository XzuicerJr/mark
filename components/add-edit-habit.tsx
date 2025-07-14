"use client";

import IconPickerDrawer from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { HabitProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import z from "@/lib/zod";
import { createHabitBodySchema } from "@/lib/zod/schema/habits";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon, PencilLine, PlusIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { getColor } from "./get-color";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function AddEditHabit({
  inHeader = false,
  props,
}: {
  inHeader?: boolean;
  props?: HabitProps;
}) {
  const [showModal, setShowModal] = useState(false);
  const { theme: themeFromProvider } = useTheme();
  const theme = themeFromProvider as "light" | "dark";

  const form = useForm<z.infer<typeof createHabitBodySchema>>({
    resolver: zodResolver(createHabitBodySchema),
    defaultValues: props
      ? {
          ...props,
          startDate: new Date(props.startDate).toISOString(),
        }
      : {
          name: "",
          description: "",
          icon: "Sparkles",
          color: "blue",
          startDate: new Date().toISOString(),
        },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const endpoint = useMemo(
    () =>
      props
        ? {
            method: "PATCH",
            url: `/api/habits/${props.id}`,
            successMessage: "Habit updated successfully",
          }
        : {
            method: "POST",
            url: `/api/habits`,
            successMessage: "Habit created successfully",
          },
    [props],
  );

  const onSubmit = async (data: z.infer<typeof createHabitBodySchema>) => {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          ...(props?.id && { habitId: props.id }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create habit");
      }

      form.reset();
      mutate("/api/habits");
      toast.success(endpoint.successMessage);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/habits/${props?.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete habit");
      }

      mutate("/api/habits");
      toast.success("Habit deleted successfully");
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const ButtonComponent = props ? (
    <Button
      variant="outline"
      size="icon"
      className={inHeader ? "size-12 rounded-xl" : ""}
      onClick={() => setShowModal(true)}
    >
      <PencilLine className="size-4" />
    </Button>
  ) : (
    <Button
      variant={inHeader ? "outline" : "default"}
      onClick={() => setShowModal(true)}
    >
      <PlusIcon className="size-4" />
      Add Habit
    </Button>
  );

  return (
    <>
      {ButtonComponent}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={props ? "Edit Habit" : "New Habit"}
        description={
          !props ? "Add a new habit to your daily routine." : undefined
        }
        footer={{
          ...(props && {
            onDelete: {
              action: handleDelete,
              modal: {
                title: "Delete Habit",
                content: (
                  <p className="text-sm">
                    Are you sure you want to delete this habit? This action
                    cannot be undone.
                  </p>
                ),
              },
            },
          }),
          onSubmit: {
            action: handleSubmit(onSubmit),
            text: props ? "Update Habit" : "Add Habit",
          },
          onCancel: {
            text: "Cancel",
          },
        }}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <IconPickerDrawer
            selectedIcon={form.watch("icon")}
            onIconSelect={(icon) => form.setValue("icon", icon)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              {...register("name")}
              className="max-w-full"
              error={errors.name?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input
              {...register("description")}
              className="max-w-full"
              error={errors.description?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="plain"
                  className="focus:border-foreground focus:ring-foreground cursor-pointer justify-between border border-neutral-300 font-normal"
                >
                  {form.watch("startDate")
                    ? format(form.watch("startDate"), "MMM d, yyyy")
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={
                    form.watch("startDate")
                      ? new Date(form.watch("startDate"))
                      : undefined
                  }
                  onSelect={(date) =>
                    form.setValue("startDate", date?.toISOString() ?? "")
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {[
                "green",
                "red",
                "yellow",
                "blue",
                "purple",
                "orange",
                "pink",
              ].map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  className={cn("h-10 flex-1 border-2")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      form.setValue("color", color as HabitProps["color"]);
                    }
                  }}
                  onClick={() =>
                    form.setValue("color", color as HabitProps["color"])
                  }
                  style={{
                    backgroundColor:
                      getColor[color as HabitProps["color"]][theme].log.done,
                    borderColor:
                      form.watch("color") !== color
                        ? getColor[color as HabitProps["color"]][theme].log.done
                        : "var(--accent-foreground)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
