import { IconSeparator } from "@tabler/icons-react";
import React from "react";

export default function SectionBreak() {
  return (
    <div className="py-3 mt-1 w-full flex justify-center gap-2 text-purple-400">
      <IconSeparator size={18} />
      <IconSeparator size={18} />
      <IconSeparator size={18} />
    </div>
  );
}
