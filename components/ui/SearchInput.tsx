"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/shadcn/input";
import { ChangeEvent } from "react";

type SearchInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fog pointer-events-none" />
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="pl-9 h-9 rounded-xl bg-white"
    />
  </div>
);

export default SearchInput;
