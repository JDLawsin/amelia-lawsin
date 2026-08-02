"use client";

import FormField from "./FormField";
import { Input } from "./shadcn/input";
import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string[];
  hint?: string;
  containerClassName?: string;
  rightElement?: React.ReactNode;
}

const FormInput = ({
  id,
  name,
  label,
  errors,
  hint,
  required,
  className,
  containerClassName,
  rightElement,
  ...props
}: Props) => {
  if (!id || !name) {
    throw new Error("FormInput requires both id and name");
  }

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      errors={errors}
      hint={hint}
      containerClassName={containerClassName}
    >
      <div className="relative">
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
            rightElement && "pr-10",
            className,
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </FormField>
  );
};

export default FormInput;
