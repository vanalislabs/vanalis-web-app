"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface MultipleTextInputsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

const MultipleTextInputs = React.forwardRef<
  HTMLDivElement,
  MultipleTextInputsProps
>(
  (
    { className, label, values, onValuesChange, placeholder, required, ...props },
    ref,
  ) => {
    const handleAddInput = () => {
      onValuesChange([...values, ""]);
    };

    const handleRemoveInput = (index: number) => {
      const newValues = values.filter((_, i) => i !== index);
      // If it's a required field and it's the last input, don't remove it, just clear it.
      if (required && newValues.length === 0) {
        onValuesChange([""]);
        return;
      }
      onValuesChange(newValues);
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
    ) => {
      const newValues = [...values];
      newValues[index] = e.target.value;
      onValuesChange(newValues);
    };

    return (
      <div className={cn("grid gap-2", className)} ref={ref} {...props}>
        <div className="flex items-center justify-between">
          <Label>{label} {required && <span className="text-red-600">*</span>}</Label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleAddInput}
            className="h-6 w-6"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Input</span>
          </Button>
        </div>
        <div className="grid gap-2">
          {values.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(e, index)}
                placeholder={placeholder}
                required={required && index === 0}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveInput(index)}
                disabled={required && values.length === 1}
                className="h-9 w-9 flex-shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove Input</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

MultipleTextInputs.displayName = "MultipleTextInputs";

export { MultipleTextInputs };
