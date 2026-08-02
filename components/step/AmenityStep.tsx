import { Controller, Control, useFieldArray } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";
import { useMemo } from "react";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const IconPreview = ({ name }: { name: string }) => {
  const Icon = useMemo(() => {
    const iconName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return (
      (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }>
        >
      )[iconName] ?? null
    );
  }, [name]);

  if (!Icon) {
    return <span className="text-xs text-ash">No preview</span>;
  }

  return <Icon className="w-5 h-5 text-ink" />;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Controller
              name={`amenities.${index}.icon`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`amenities.${index}.icon`}
                  label="Icon Name"
                  placeholder="e.g. Waves, Dumbbell, Shield"
                  hint="Use a Lucide icon name like Waves or Dumbbell"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                  rightElement={<IconPreview name={field.value ?? ""} />}
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
        Add Amenity
      </Button>
    </div>
  );
};

export default AmenityStep;
