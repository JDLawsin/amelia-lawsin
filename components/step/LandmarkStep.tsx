import { Controller, Control, useFieldArray } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Trash2 } from "lucide-react";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

interface LandmarksStepProps {
  control: Control<FullPropertyFormValues>;
}

const LandmarkStep = ({ control }: LandmarksStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "landmarks",
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel>Nearby Landmarks</SectionLabel>

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
            name={`landmarks.${index}.name`}
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                id={`landmarks.${index}.name`}
                label="Landmark Name"
                placeholder="e.g. SM City Cebu"
                required
                errors={
                  fieldState.error ? [fieldState.error.message!] : undefined
                }
                {...field}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Controller
              name={`landmarks.${index}.category`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`landmarks.${index}.category`}
                  label="Category"
                  placeholder="Mall, School, Hospital"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name={`landmarks.${index}.distance`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`landmarks.${index}.distance`}
                  label="Distance"
                  placeholder="e.g. 1.2 km"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                />
              )}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "" })}
        className="w-fit"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Landmark
      </Button>
    </div>
  );
};

export default LandmarkStep;
