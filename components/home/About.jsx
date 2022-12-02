import SubscriptionForm from "@components/SubscriptionForm";
import { APP_TITLE } from "@constants/app";
import profilePic from "@images/about-1.png";
import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <div className="container-fluid py-3 shadow">
      <div className="container px-0">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center">
            <Image
              src={profilePic}
              width={330}
              blurDataURL={profilePic.blurDataURL}
              alt="Amittras' Profile Image"
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h1 className="display-3 text-primary">Hi! I Am Amittras.</h1>
            <p>
              {APP_TITLE} is a place where I pen down the thoughts that come to
              my mind from all around me. I turn them to stories, sometimes
              little thoughts, and sometimes just a mess of words.
            </p>
            <p>
              Come along if you too want to sneak a peek into the dark,
              sometimes funny, mostly twisted thinking process of my mind...
            </p>
            <p>Find Stories down below....</p>
            <SubscriptionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
