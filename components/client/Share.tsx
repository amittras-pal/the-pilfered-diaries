"use client";

import { app } from "@firebase/client.config";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { getAnalytics, logEvent } from "firebase/analytics";
import { SITE_TITLE, SITE_URL } from "@constants/app";

interface ShareProps {
  contentTitle: string;
  contentType: string;
}

const platforms = [
  {
    name: "whatsapp",
    path: "https://api.whatsapp.com/send",
    icon: <IconBrandWhatsapp size={18} />,
    label: "Whatsapp",
  },
  {
    name: "facebook",
    path: "https://www.facebook.com/sharer.php",
    icon: <IconBrandFacebook size={18} />,
    label: "Facebook",
  },
  {
    name: "twitter",
    path: "https://twitter.com/intent/tweet",
    icon: <IconBrandTwitter size={18} />,
    label: "Twitter",
  },
  {
    name: "linkedin",
    path: "https://www.linkedin.com/shareArticle",
    icon: <IconBrandLinkedin size={18} />,
    label: "LinkedIn",
  },
];

function generateParams(params: Record<string, string>) {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlParams.set(key, value);
  });
  return urlParams.toString();
}

export default function Share(props: ShareProps) {
  const handleShare = (platform: (typeof platforms)[0]) => {
    let shareLink = "";
    switch (platform.name) {
      case "whatsapp":
        shareLink = `${platform.path}?${generateParams({
          text: `Read “${props.contentTitle}” on ${SITE_TITLE}:${
            SITE_URL + window.location.pathname
          }`,
        })}`;
        break;
      case "facebook":
        shareLink = `${platform.path}?${generateParams({
          t: `Read “${props.contentTitle}” on ${SITE_TITLE}`,
          u: SITE_URL + window.location.pathname,
        })}`;
        break;
      case "twitter":
      case "linkedin":
        shareLink = `${platform.path}?${generateParams({
          text: `Read “${props.contentTitle}” on ${SITE_TITLE}`,
          url: SITE_URL + window.location.pathname,
        })}`;
        break;
      default:
        break;
    }

    const analytics = getAnalytics(app);
    logEvent(analytics, "share", {
      method: platform.label,
      content_type: props.contentType,
      item_id: props.contentTitle,
    });

    window.open(shareLink);
  };

  return (
    <>
      <p className="text-lg text-violet-300 mb-2">
        Share &ldquo;{props.contentTitle}&rdquo;
      </p>
      <div className="flex rounded-lg overflow-hidden w-fit border border-gray-700">
        {platforms.map((pf) => (
          <button
            className="btn btn-sm btn-ghost rounded-none"
            key={pf.name}
            onClick={() => handleShare(pf)}
          >
            {pf.icon}
            <span className="hidden md:block">{pf.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
