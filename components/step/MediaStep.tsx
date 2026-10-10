"use client";

import { useState } from "react";
import { Control, Controller, useController } from "react-hook-form";
import SectionLabel from "@/components/ui/SectionLabel";
import FormInput from "@/components/ui/FormInput";
import ImageItemsEditor, {
  ImageItem,
} from "@/components/ui/ImageItemsEditor";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

interface MediaStepProps {
  control: Control<FullPropertyFormValues>;
}

const MediaStep = ({ control }: MediaStepProps) => {
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "imageItems",
  });

  const handleChange = (items: ImageItem[]) => {
    onChange(items);
  };

  const handleDeleteExisting = (id: string) => {
    setDeletedImageIds((prev) => [...prev, id]);
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionLabel>Property Images</SectionLabel>

      <ImageItemsEditor
        items={(value as ImageItem[]) ?? []}
        onChange={handleChange}
        onDeleteExisting={handleDeleteExisting}
        maxFiles={10}
      />

      {deletedImageIds.length > 0 && (
        <input
          type="hidden"
          name="deletedImageIds"
          value={JSON.stringify(deletedImageIds)}
        />
      )}

      <SectionLabel>Virtual Tour / Video</SectionLabel>
      <p className="text-xs text-ash -mt-2">
        Optional. Paste a YouTube, Vimeo, or Matterport link for remote buyers.
      </p>

      <Controller
        name="virtualTourUrl"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="virtualTourUrl"
            label="Tour or video URL"
            placeholder="https://www.youtube.com/watch?v=..."
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />
    </div>
  );
};

export default MediaStep;
