import { IconMenu2 } from "@tabler/icons-react";
import React from "react";
import { SITE_TITLE } from "../constants";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
            <IconMenu2 size={20} />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 border border-gray-700"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/stories">Stories & Narratives</Link>
            </li>
            <li>
              <Link href="/posts">Posts</Link>
            </li>
            {/* TODO: Add Pages. */}
            {/* <li>
              <Link href="/submissions">Submit Your Work</Link>
            </li> */}
          </ul>
        </div>
        <Link
          href="/"
          className="btn btn-ghost btn-sm normal-case font-serif text-xl"
        >
          {SITE_TITLE}
        </Link>
      </div>
    </div>
  );
}
