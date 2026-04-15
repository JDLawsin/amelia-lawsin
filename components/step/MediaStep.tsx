import { Controller, Control } from "react-hook-form";
import SectionLabel from "@/components/ui/SectionLabel";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

interface MediaStepProps {
  control: Control<FullPropertyFormValues>;
  onFilesSelected?: (files: File[]) => void;
}

const MediaStep = ({ control, onFilesSelected }: MediaStepProps) => (
  <div className="flex flex-col gap-5">
    <SectionLabel>Property Images</SectionLabel>

    <Controller
      name="images"
      control={control}
      render={({ field, fieldState }) => (
        <MultiImageUpload
          value={field.value || []}
          onValueChange={field.onChange}
          onFilesSelected={onFilesSelected}
          maxFiles={10}
          hint="Upload high-quality photos. First image will be used as cover."
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
        />
      )}
    />
  </div>
);

export default MediaStep;
