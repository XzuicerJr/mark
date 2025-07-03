"use client";

import { getColor } from "@/components/habit";
import IconPickerDrawer from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AddHabit() {
  const [showModal, setShowModal] = useState(false);
  const theme = "dark"; // TODO: Add theme selector

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Sparkles",
    color: "blue",
  });

  const handleIconSelect = (iconName: string) => {
    setFormData((prev) => ({ ...prev, icon: iconName }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // TODO: Implement habit creation logic
    console.log("Creating habit:", formData);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Add Habit</Button>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title="New Habit"
        description="Add a new habit to your daily routine."
        footer={{
          onSubmit: {
            action: handleSubmit,
            text: "Add Habit",
          },
          onCancel: {
            text: "Cancel",
          },
        }}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <IconPickerDrawer
            selectedIcon={formData.icon}
            onIconSelect={handleIconSelect}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              className="max-w-full"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input
              className="max-w-full"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
                  onClick={() => handleInputChange("color", color)}
                  style={{
                    backgroundColor:
                      getColor[color as keyof typeof getColor][theme].log.done,
                    borderColor:
                      formData.color !== color
                        ? getColor[color as keyof typeof getColor][theme].log
                            .done
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
