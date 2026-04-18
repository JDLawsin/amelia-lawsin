import { Controller, Control } from "react-hook-form";
import SectionLabel from "@/components/ui/SectionLabel";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

interface MediaStepProps {
  control: Control<FullPropertyFormValues>;
}

const MediaStep = ({ control }: MediaStepProps) => (
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

export default MediaStep;
