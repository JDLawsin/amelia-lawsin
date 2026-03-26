"use client";

import { ReactNode } from "react";
import { Input } from "./shadcn/input";
import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string[];
  hint?: string;
  rightSlot?: ReactNode;
  containerClassName?: string;
}

export const FormInput = ({
  id,
  name,
  label,
  errors,
  hint,
  rightSlot,
  required,
  className,
  containerClassName,
  ...props
}: Props) => {
  if (!id || !name) {
    throw new Error("FormInput requires both id and name");
  }

  return (
    <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-ink flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </span>
        </label>
      )}

      <Input
        id={id}
        name={name}
        {...props}
        className={clsx(
          "h-11 rounded-xl bg-background",
          "border border-input",
          "shadow-apple-sm",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "transition-all",
          errors?.length && "border-destructive focus-visible:ring-destructive",
          className,
        )}
      />

      {errors?.length ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {errors[0]}
        </p>
      ) : hint ? (
        <p className="text-xs text-fog">{hint}</p>
      ) : null}

      {rightSlot && <div className="self-end">{rightSlot}</div>}
    </div>
  );
};
