import { Controller, Control } from "react-hook-form";
import SectionLabel from "@/components/ui/SectionLabel";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";
import PropertyImageManager from "@/app/(admin)/admin/properties/[slug]/update/_components/PropertyImageManager";

interface MediaStepProps {
  control: Control<FullPropertyFormValues>;
  existingImages?: Array<{
    id: string;
    url: string;
    publicId: string;
    isPrimary: boolean;
    order: number;
  }>;
}

const MediaStep = ({ control, existingImages = [] }: MediaStepProps) => {
  const isEditMode = existingImages.length > 0;

  if (isEditMode) {
    return (
      <div className="flex flex-col gap-5">
        <SectionLabel>Property Images</SectionLabel>

        <Controller
          name="images"
          control={control}
          render={({ field, fieldState }) => (
            <PropertyImageManager
              existingImages={existingImages}
              newFiles={field.value || []}
              onNewFilesChange={field.onChange}
              errors={fieldState.error}
            />
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionLabel>Property Images</SectionLabel>

      <Controller
        name="images"
        control={control}
        render={({ field, fieldState }) => (
          <MultiImageUpload
            value={field.value || []}
            onValueChange={field.onChange}
            errors={fieldState.error}
            maxFiles={10}
          />
        )}
      />
    </div>
  );
};

export default MediaStep;
