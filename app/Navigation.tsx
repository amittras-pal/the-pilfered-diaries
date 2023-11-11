import { IconDots } from "@tabler/icons-react";
import React from "react";
import { SITE_TITLE } from "./constants";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="navbar bg-base-100 backdrop-blur-md">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl text-white">
          {SITE_TITLE}
        </Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <IconDots size={20} />
        </button>
      </div>
    </nav>
  );
}
