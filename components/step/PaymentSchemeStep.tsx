import { Controller, Control, useFieldArray } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Trash2 } from "lucide-react";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const PaymentSchemeStep = ({ control }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "paymentSchemes",
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel>Payment Schemes</SectionLabel>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-wire rounded-2xl p-6 relative"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-destructive"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>

          <Controller
            name={`paymentSchemes.${index}.type`}
            control={control}
            render={({ field, fieldState }) => (
              <FormSelect
                id={`paymentSchemes.${index}.type`}
                name={`paymentSchemes.${index}.type`}
                label="Payment Type"
                options={[
                  { value: "SPOT_CASH", label: "Spot Cash" },
                  { value: "IN_HOUSE_FINANCING", label: "In-House Financing" },
                  { value: "BANK_FINANCING", label: "Bank Financing" },
                  { value: "PAG_IBIG_FINANCING", label: "Pag-IBIG Financing" },
                  { value: "RENT_TO_OWN", label: "Rent to Own" },
                ]}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                required
                errors={
                  fieldState.error ? [fieldState.error.message!] : undefined
                }
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Controller
              name={`paymentSchemes.${index}.monthlyAmount`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`paymentSchemes.${index}.monthlyAmount`}
                  type="number"
                  label="Monthly Amount"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />

            <Controller
              name={`paymentSchemes.${index}.terms`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`paymentSchemes.${index}.terms`}
                  type="number"
                  label="Terms (months)"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ type: "SPOT_CASH" })}
        className="w-fit"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Payment Scheme
      </Button>
    </div>
  );
};

export default PaymentSchemeStep;
