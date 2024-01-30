import logo from "@resources/tpd-logo-w.svg";
import {
  IconBrandFirebase,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandVercel,
  IconCircle,
  IconCopyright,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import {
  INSTA_LINK,
  LINKEDIN_LINK,
  REPO_LINK,
  SITE_TITLE,
} from "../constants/app";

export default function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-4">
      <aside>
        <Image
          src={logo}
          width={130}
          height={130}
          alt="logo"
          className="mb-3 opacity-50"
        />
        <p className="font-display text-lg text-white">{SITE_TITLE}</p>
        <p>When a thinker finds lost words, stories happen</p>
        <p className="mt-2 text-gray-500">
          <IconCopyright className="inline mr-1" size={16} />
          {SITE_TITLE} {dayjs().format("YYYY")}
        </p>
      </aside>

      <nav>
        <h6 className="footer-title">What to read</h6>
        <Link href="/posts" className="link link-hover">
          Short Posts
        </Link>
        <Link href="/stories" className="link link-hover">
          Stories & Narratives
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Your Way Around Here</h6>
        <Link href="/about" className="link link-hover">
          About Me
        </Link>
        <Link href="/about#contact" className="link link-hover">
          Contact
        </Link>
        <Link href="/submissions" className="link link-hover">
          Contribute Your Work
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">More</h6>
        <a target="_blank" href={INSTA_LINK} className="link link-hover">
          <IconBrandInstagram className="mr-1 inline" />
          Follow {SITE_TITLE}
        </a>
        <a target="_blank" href={LINKEDIN_LINK} className="link link-hover">
          <IconBrandLinkedin className="mr-1 inline" />
          Amittras Pal
        </a>
        <a target="_blank" href={REPO_LINK} className="link link-hover">
          <IconBrandGithub className="mr-1 inline" />
          Explore Source Code
        </a>
        <div className="flex gap-1 w-full items-center mt-1 pt-3 border-t border-t-gray-700">
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            className="tooltip"
            data-tip="Styled with TailwindCSS"
          >
            <IconBrandTailwind />
          </a>
          <IconCircle size={8} />
          <a
            href="https://nextjs.org/"
            target="_blank"
            className="tooltip"
            data-tip="Built with NextJS"
          >
            <IconBrandNextjs />
          </a>
          <IconCircle size={8} />
          <a
            href="https://vercel.com/"
            target="_blank"
            className="tooltip"
            data-tip="Hosted on Vercel"
          >
            <IconBrandVercel />
          </a>
          <IconCircle size={8} />
          <a
            href="https://firebase.google.com/"
            target="_blank"
            className="tooltip"
            data-tip="Firebase"
          >
            <IconBrandFirebase />
          </a>
        </div>
      </nav>
    </footer>
  );
}
