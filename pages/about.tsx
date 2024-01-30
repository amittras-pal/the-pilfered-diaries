import { yupResolver } from "@hookform/resolvers/yup";
import { IconArrowRight, IconCircleCheck, IconSend } from "@tabler/icons-react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import Input from "../components/form/Input";
import TextArea from "../components/form/TextArea";
import { REVAL_TIME, SITE_TITLE, SITE_URL } from "../constants/app";
import { firestore } from "../firebase/client.config";
import { getSiteImageCfg } from "../firebase/server.functions";
import { SiteImageCfg } from "../types/entities";
import { AboutProps } from "../types/page";

const messageSchema = object().shape({
  name: string().required("Name is required."),
  email: string().email("Invalid Email").required("Email Id is required."),
  message: string()
    .required("Message is required")
    .min(20, "Message should be between 20-1024 characters in length")
    .max(1024, "Message should be between 20-1024 characters in length"),
});

type MessageForm = InferType<typeof messageSchema>;

export default function About(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [sending, setSending] = useState(false);
  const [sentAMessage, setSentAMessage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MessageForm>({
    defaultValues: {
      email: "",
      message: "",
      name: "",
    },
    mode: "onBlur",
    resolver: yupResolver(messageSchema),
    shouldFocusError: true,
  });

  const saveMessage: SubmitHandler<MessageForm> = async (values) => {
    setSending(true);
    try {
      const messages = collection(firestore, "messages");
      await addDoc(messages, {
        ...values,
        date: Timestamp.fromDate(new Date()),
        viewed: false,
      });
      setSentAMessage(true);
      sessionStorage.setItem("sentAMessage", "true");
    } catch (err) {
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("sentAMessage")) setSentAMessage(true);
  }, []);

  return (
    <>
      <NextSeo
        title={`About | ${SITE_TITLE}`}
        description="About this blog and a little bit about me!"
        openGraph={{
          url: SITE_URL + "/about",
        }}
      />
      <div id="about_page">
        <header className="flex flex-col items-center md:flex-row gap-2 md:gap-3 max-w-screen-2xl mx-auto py-4 px-3">
          <section className="basis-1/2 flex justify-center">
            <Image
              src={props.image}
              width={330}
              height={330}
              alt="Amittras' Profile Image"
            />
          </section>
          <section className="basis-1/2">
            <h1 className="font-body text-purple-400 text-3xl mb-1">
              Hi! I Am Amittras and this is
            </h1>
            <h2 className="text-white text-4xl md:text-6xl mb-6">
              {SITE_TITLE}
            </h2>
            <p className="text-gray-300 italic mb-3">
              A blog/showcase of my adventures in the literary space. Ideas,
              that are pilfered from what many call the “muse” and I call the
              reticent witch. I write stuff, read a lot more, and sometimes just
              explore little thoughts that run through my head at the most
              random hours of the day.
            </p>

            <p className="text-gray-300 italic mb-3">
              Dark, Twisted, Relatable, and sometimes outright crazy, this blog,
              The Pilfered Diaries is an experiment, a journal, a way for me to
              collaborate with people who are like me. More often than not, you
              will find in here something that might make you think. Come along
              with me, on a journey that has a lot of chill breaks, wild
              thoughts, and scenes that make you question the sanity of the
              writer...
            </p>

            <p className="text-gray-300 italic mb-3">
              Oh, by the way, Cats are better than dogs, change my mind!...
            </p>
          </section>
        </header>
        <div className="mt-3 flex flex-col md:flex-row gap-2 md:gap-3 max-w-screen-xl mx-auto py-4 px-3">
          <section className="basis-1/2">
            <h3 className="text-white text-2xl mb-4">
              What&rsquo;s Exciting Around Here...
            </h3>
            <Link
              href="/stories"
              className="w-full block rounded-lg bg-gray-800 hover:bg-gray-900 p-3 mb-3 transition-colors"
            >
              <h4 className="text-xl text-purple-400 flex gap-3 items-center">
                <span>Explore Stories</span>
                <span>
                  <IconArrowRight size={20} />
                </span>
              </h4>
              <p className="text-white">
                I am no accomplished writer, but like many others, I like to
                cook up scenarios in my head and pen them down sometimes.
              </p>
            </Link>
            <Link
              href="/posts"
              className="w-full block rounded-lg bg-gray-800 hover:bg-gray-900 p-3 mb-3 transition-colors"
            >
              <h4 className="text-xl text-purple-400 flex gap-3 items-center">
                <span>Explore Short Posts</span>
                <span>
                  <IconArrowRight size={20} />
                </span>
              </h4>
              <p className="text-white">
                Little thoughts, ideas and incidents, that I keep track of, and
                try to compile into coherent scenarios.
              </p>
            </Link>
            <Link
              href="/submissions"
              className="w-full block rounded-lg bg-gray-800 hover:bg-gray-900 p-3 mb-3 transition-colors"
            >
              <h4 className="text-xl text-purple-400 flex gap-3 items-center">
                <span>Get Featured</span>
                <span>
                  <IconArrowRight size={20} />
                </span>
              </h4>
              <p className="text-white">
                You can send your work to {SITE_TITLE}. Let&apos;s collborate
                and build a story that originates with you, and showcases
                here...
              </p>
            </Link>
          </section>
          <section className="basis-1/2" id="contact">
            <h3 className="text-white text-2xl mb-4">Write to me...</h3>
            {sentAMessage ? (
              <div
                role="alert"
                className="alert alert-success shadow-md font-body items-start rounded-md"
              >
                <IconCircleCheck size={24} />
                <span>
                  Your message was sent successfully. I&apos;ll read it soon.
                  And I&apos;ll get back to you on the email you provided if I
                  need to talk more.
                </span>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit(saveMessage)}>
                <Input
                  {...register("name")}
                  label="Your Name"
                  error={errors.name?.message ?? ""}
                  required
                  disabled={sending}
                />
                <Input
                  {...register("email")}
                  label="Email Address"
                  help="Your email is kept private"
                  error={errors.email?.message ?? ""}
                  required
                  disabled={sending}
                />
                <TextArea
                  {...register("message")}
                  label="Message"
                  help={`${watch("message").length}/1024 characters.`}
                  error={errors.message?.message ?? ""}
                  rows={3}
                  required
                  disabled={sending}
                />
                <div className="flex justify-end mt-2">
                  <button className="btn btn-sm btn-success">
                    <IconSend size={18} />
                    Send
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  const res = await getSiteImageCfg();
  return {
    props: { image: (res.data() as SiteImageCfg).profileAbout },
    revalidate: REVAL_TIME,
  };
};
