"use client";

import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import FormField from "./FormField";

type Option = { value: string; label: string };

interface Props {
  id: string;
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  errors?: string[];
  hint?: string;
  required?: boolean;
  containerClassName?: string;
  value: string;
  onValueChange: (value: string) => void;
}

const FormSelect = ({
  id,
  name,
  label,
  options,
  placeholder = "Select...",
  errors,
  hint,
  required,
  containerClassName,
  value,
  onValueChange,
}: Props) => {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      errors={errors}
      hint={hint}
      containerClassName={containerClassName}
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className={clsx(
            "h-11 rounded-xl bg-background shadow-apple-sm",
            errors?.length && "border-destructive",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default FormSelect;
