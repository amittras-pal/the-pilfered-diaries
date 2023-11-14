import { SITE_TITLE } from "@constants/app";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import Divider from "../Divider";
import SubscriptionForm from "./SubscriptionForm";

export default function SubmitOrDonateAside() {
  return (
    <aside className="basis-3/12 h-fit px-6 py-4 md:pt-0 md:px-4 mb-4 sticky top-0 ">
      <SubscriptionForm />
      <Divider className="my-3" direction="horizontal" />
      <h4 className="text-xl text-violet-300">Submit Your Own...</h4>
      <p className="mt-3 text-sm">
        You can submit your own literary work, long form stories, short
        compositions et cetera to {SITE_TITLE} and have them be part of this
        collection of thoughts...
      </p>
      <Link
        href="/submissions"
        className="btn btn-sm mt-3 w-full btn-ghost font-sans justify-between"
      >
        Learn More... <IconArrowRight size={20} />
      </Link>
    </aside>
  );
}
