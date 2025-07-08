"use client";

import { getColor, HabitProps } from "@/components/habit";
import IconPickerDrawer from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import z from "@/lib/zod";
import { createHabitBodySchema } from "@/lib/zod/schema/habits";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddHabit({ inHeader = false }: { inHeader?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const theme = "dark"; // TODO: Add theme selector

  const form = useForm<z.infer<typeof createHabitBodySchema>>({
    resolver: zodResolver(createHabitBodySchema),
    defaultValues: {
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

  const onSubmit = async (data: z.infer<typeof createHabitBodySchema>) => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create habit");
      }

      const responseData = await response.json();

      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const ButtonComponent = inHeader ? (
    <div className="mb-4 flex justify-end">
      <Button onClick={() => setShowModal(true)}>
        <PlusIcon className="size-4" />
        Add Habit
      </Button>
    </div>
  ) : (
    <Button onClick={() => setShowModal(true)}>
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
        title="New Habit"
        description="Add a new habit to your daily routine."
        footer={{
          onSubmit: {
            action: handleSubmit(onSubmit),
            text: "Add Habit",
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
