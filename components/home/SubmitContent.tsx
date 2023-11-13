import { SITE_TITLE } from "@constants/app";
import logo from "@resources/tpd-logo-w.svg";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function SubmitContent() {
  return (
    <div className="my-3 py-3 border-t border-b md:border-b-0 border-gray-700">
      <h2 className="text-2xl text-violet-300 font-serif mb-3">
        Want to see your content here?
      </h2>
      <div className="flex gap-2 flex-col items-center md:flex-row">
        <Image
          src={logo}
          width={130}
          height={130}
          alt="logo"
          className="mb-3"
        />
        <div>
          <p className="mb-3">
            {SITE_TITLE} is designed as a collaborative platform for all who
            wish to put their thoughts out in the open. You are welcome to send
            in your thoughts, be they complete works of fiction, non-fiction, or
            simple short composistions.
          </p>
          <p className="mb-3">
            We can make it all stand out in this journal of lost words...
          </p>
        </div>
      </div>
      <Link
        href="/submissions"
        className="btn mt-3 w-full md:w-fit btn-warning font-sans justify-between"
      >
        Explore Submissions... <IconArrowRight size={20} />
      </Link>
    </div>
  );
}
