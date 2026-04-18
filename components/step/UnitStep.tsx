import { Controller, Control, useFieldArray } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Trash2 } from "lucide-react";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

interface UnitsStepProps {
  control: Control<FullPropertyFormValues>;
}

const UnitsStep = ({ control }: UnitsStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "units",
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel>Property Units</SectionLabel>
      <p className="text-sm text-fog">
        Add details for individual units (condos, townhouses, etc.)
      </p>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-wire rounded-2xl p-6 relative bg-cloud/30"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name={`units.${index}.label`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.label`}
                  label="Unit Label"
                  placeholder="e.g. Tower A - Unit 1203"
                  required
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name={`units.${index}.towerOrPhase`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.towerOrPhase`}
                  label="Tower / Phase"
                  placeholder="e.g. Tower A"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name={`units.${index}.price`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.price`}
                  type="number"
                  label="Price"
                  placeholder="4500000"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />

            <Controller
              name={`units.${index}.bedrooms`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.bedrooms`}
                  type="number"
                  label="Bedrooms"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />

            <Controller
              name={`units.${index}.bathrooms`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.bathrooms`}
                  type="number"
                  label="Bathrooms"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />

            <Controller
              name={`units.${index}.floorArea`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.floorArea`}
                  type="number"
                  label="Floor Area (sqm)"
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
        onClick={() => append({ label: "" })}
        className="w-fit"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Another Unit
      </Button>
    </div>
  );
};

export default UnitsStep;
