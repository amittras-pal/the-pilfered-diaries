import { SITE_TITLE } from "@constants/app";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start w-auto gap-3">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
            <IconMenu2 size={20} />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 border border-gray-700"
          >
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            {/* TODO: About */}
            <li>
              <Link href="/stories" className="hover:text-white">
                Stories & Narratives
              </Link>
            </li>
            <li>
              <Link href="/posts" className="hover:text-white">
                Posts
              </Link>
            </li>
            <li>
              <Link href="/submissions">Submit Your Work</Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="text-2xl font-display text-gray-200">
          {SITE_TITLE}
        </Link>
      </div>
    </div>
  );
}
