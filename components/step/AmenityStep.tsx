import { Controller, Control, useFieldArray } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Trash2 } from "lucide-react";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const AmenityStep = ({ control }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel>Amenities & Facilities</SectionLabel>

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
            name={`amenities.${index}.name`}
            control={control}
            render={({ field, fieldState }) => (
              <FormInput
                id={`amenities.${index}.name`}
                label="Amenity Name"
                placeholder="e.g. Swimming Pool, Gym, 24/7 Security"
                required
                errors={
                  fieldState.error ? [fieldState.error.message!] : undefined
                }
                {...field}
              />
            )}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "" })}
        className="w-fit"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Amenity
      </Button>
    </div>
  );
};

export default AmenityStep;
