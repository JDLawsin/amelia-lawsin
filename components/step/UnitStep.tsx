import { Controller, Control, useFieldArray } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";
import { PropertyStatus } from "@/app/generated/prisma/enums";
import { compressImage } from "@/lib/image/compressImage";
import { ALLOWED_TYPES, MAX_SIZE } from "@/constants";

interface UnitsStepProps {
  control: Control<FullPropertyFormValues>;
}

const statusOptions = [
  { value: "", label: "Select status" },
  { value: "FOR_SALE", label: "For Sale" },
  { value: "FOR_RENT", label: "For Rent" },
  { value: "PRE_SELLING", label: "Pre-selling" },
  { value: "SOLD", label: "Sold" },
  { value: "RENTED", label: "Rented" },
];

const UnitsStep = ({ control }: UnitsStepProps) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "units",
  });

  const handleFloorPlanChange = async (
    index: number,
    file: File | undefined,
  ) => {
    if (!file) {
      update(index, {
        ...fields[index],
        floorPlanImageFile: undefined,
      } as FullPropertyFormValues["units"][number]);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
      return;
    }

    const compressed = await compressImage(file, { preset: "floorPlan" });
    update(index, {
      ...fields[index],
      floorPlanImageFile: compressed,
    } as FullPropertyFormValues["units"][number]);
  };

  const handleRemoveFloorPlan = (index: number) => {
    update(index, {
      ...fields[index],
      floorPlanImage: undefined,
      floorPlanPublicId: undefined,
      floorPlanImageFile: undefined,
    } as FullPropertyFormValues["units"][number]);
  };

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
              name={`units.${index}.status`}
              control={control}
              render={({ field, fieldState }) => (
                <FormSelect
                  id={`units.${index}.status`}
                  name={`units.${index}.status`}
                  label="Status"
                  options={statusOptions}
                  value={field.value ?? ""}
                  onValueChange={(value) =>
                    field.onChange(
                      value === "" ? undefined : (value as PropertyStatus),
                    )
                  }
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
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
              name={`units.${index}.priceLabel`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.priceLabel`}
                  label="Price Label"
                  placeholder="e.g. Negotiable"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name={`units.${index}.lotArea`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.lotArea`}
                  type="number"
                  label="Lot Area (sqm)"
                  placeholder="e.g. 120"
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

            <Controller
              name={`units.${index}.parking`}
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  id={`units.${index}.parking`}
                  type="number"
                  label="Parking Slots"
                  placeholder="e.g. 1"
                  errors={
                    fieldState.error ? [fieldState.error.message!] : undefined
                  }
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />

            <div className="md:col-span-2">
              <p className="text-xs font-medium text-ink mb-2">Floor Plan</p>
              <Controller
                name={`units.${index}.floorPlanImage`}
                control={control}
                render={({ field }) => {
                  const previewUrl = field.value;

                  return (
                    <div className="flex flex-col gap-2">
                      {previewUrl && (
                        <div className="relative w-full max-w-xs aspect-square rounded-xl border border-wire overflow-hidden group">
                          <Image
                            src={previewUrl}
                            alt="Floor plan preview"
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveFloorPlan(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <input
                        id={`units.${index}.floorPlanImageFile`}
                        name={`units.${index}.floorPlanImageFile`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) =>
                          handleFloorPlanChange(index, e.target.files?.[0])
                        }
                        className="block w-full text-sm text-ash file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-cloud file:text-ink hover:file:bg-cloud/80"
                      />
                    </div>
                  );
                }}
              />
            </div>
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
