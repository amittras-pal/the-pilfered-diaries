import { IconSeparator } from "@tabler/icons-react";
import Link from "next/link";

function SectionBreak() {
  return (
    <div className="py-3 mt-1 w-full flex justify-center gap-2 text-purple-400">
      <IconSeparator size={18} />
      <IconSeparator size={18} />
      <IconSeparator size={18} />
    </div>
  );
}

function AuthorNoteSeparator() {
  return (
    <>
      <SectionBreak />
      <h3 className="text-purple-400">Author&apos;s Note</h3>
    </>
  );
}

export const components = { SectionBreak, AuthorNoteSeparator, Link };
