import { SITE_TITLE } from "@constants/app";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function SubmitOrDonateAside() {
  return (
    <aside className="basis-3/12 h-fit px-6 pt-4 md:pt-0 md:px-4 mb-4 sticky top-0 ">
      <h4 className="text-xl text-violet-300">Submit Your Own...</h4>
      <p className="mt-3">
        You can submit your own literary work, long form stories, short
        compositions et cetera to {SITE_TITLE} and have them be part of this
        collection of thoughts...
      </p>
      <Link
        href="/submissions"
        className="btn mt-3 w-full btn-warning font-sans justify-between"
      >
        Learn More... <IconArrowRight size={20} />
      </Link>
      {/* <div className="border-t border-gray-700/90 pt-3 mt-3">
        <h4 className="text-xl text-violet-300">Support the platform...</h4>
      </div> */}
    </aside>
  );
}
