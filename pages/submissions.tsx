import { yupResolver } from "@hookform/resolvers/yup";
import bg from "@resources/Halftone.svg";
import { IconChecks, IconSend, IconX } from "@tabler/icons-react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import Loader from "../components/Loader";
import Input from "../components/form/Input";
import TextArea from "../components/form/TextArea";
import { SITE_TITLE } from "../constants/app";
import { firestore } from "../firebase/client.config";

const submissionSchema = object().shape({
  userName: string().required("Name is required."),
  emailId: string().email("Invalid Email").required("Email Id is required."),
  ideaTitle: string()
    .required("Title is required")
    .max(180, "Title should be 180 characters or less."),
  ideaDescription: string()
    .required("Brief description is required.")
    .min(120, "Title should be between 120-1000 characters in length")
    .max(1000, "Title should be between 120-1000 characters in length"),
});
type SubmissionForm = InferType<typeof submissionSchema>;

export default function Submissions() {
  const [openBlock, setOpenBlock] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  const {
    formState: { errors },
    register,
    watch,
    reset,
    handleSubmit,
  } = useForm<SubmissionForm>({
    defaultValues: {
      userName: "",
      emailId: "",
      ideaTitle: "",
      ideaDescription: "",
    },
    mode: "onBlur",
    shouldFocusError: true,
    resolver: yupResolver(submissionSchema),
  });

  const closeForm = () => {
    dialog.current?.close();
    reset();
  };

  const submitIdea: SubmitHandler<SubmissionForm> = async (values) => {
    setSubmitting(true);
    try {
      const collectionRef = collection(firestore, "submissions");
      await addDoc(collectionRef, {
        ...values,
        submittedOn: Timestamp.fromDate(new Date()),
        discussed: false,
        used: false,
      });
      setSubmitted(true);
      closeForm();
      setTimeout(() => setSubmitted(false), 3500);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      closeForm();
    }
  };

  return (
    <>
      <header className="hero bg-base-200 h-[75vh] relative">
        <Image
          height={1080}
          width={1920}
          src={bg}
          alt="background"
          className="absolute top-0 left-0 transform rotate-90 md:rotate-0"
        />
        <div className="hero-content text-center backdrop-blur-sm rounded-md shadow-sm">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-7xl text-white">{SITE_TITLE}</h1>
            <p className="py-6 font-light text-lg md:text-xl text-violet-300">
              Submit Your Work
            </p>
            <button
              className="btn btn-success btn-xl text-2xl w-full"
              onClick={() => dialog.current?.showModal()}
            >
              Submit Your Idea!
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-screen-xl mx-auto py-4 px-2 md:px-3">
        <h1 className="text-3xl text-gray-300 mb-3">
          Do you have an interesting thought?
        </h1>
        <h4 className="tex-xl mb-8 text-violet-400">
          That you would like to share on {SITE_TITLE}...
        </h4>
        <h4>Wondering How??</h4>
      </div>
      <div className="max-w-screen-xl mx-auto px-2 md:px-3">
        <div className="collapse bg-base-200 mb-3 rounded-lg">
          <input
            type="radio"
            name="faq"
            checked={openBlock === "0"}
            onChange={() => setOpenBlock("0")}
          />
          <h2 className="collapse-title text-xl md:text-2xl text-white">
            How do I submit content to {SITE_TITLE}?
          </h2>
          <div className="collapse-content text-gray-300">
            <div className="flex gap-2 md:gap-3 items-center pb-2 mb-2 border-b border-b-gray-700">
              <span className="text-green-400">
                <IconChecks size={14} />
              </span>
              <p>
                Simply click the{" "}
                <span className="text-green-400">Submit Your Idea</span> button
                above.
              </p>
            </div>
            <div className="flex gap-2 md:gap-3 items-center pb-2 mb-2 border-b border-b-gray-700">
              <span className="text-green-400">
                <IconChecks size={14} />
              </span>
              <p>
                Fill out little information about you and your idea. Make sure
                to provide a valid email address.
              </p>
            </div>
            <div className="flex gap-2 md:gap-3 items-center pb-2 mb-2 border-b border-b-gray-700">
              <span className="text-green-400">
                <IconChecks size={14} />
              </span>
              <p>
                We will reach out to you on the mail, requesting the complete
                content and few other details relating to your composition.
              </p>
            </div>
            <div className="flex gap-2 md:gap-3 items-center pb-2 mb-2">
              <span className="text-green-400">
                <IconChecks size={14} />
              </span>
              <p>
                And that’s it. Your post is ready to be published on{" "}
                {SITE_TITLE}
              </p>
            </div>
          </div>
        </div>
        <div className="collapse bg-base-200 mb-3 rounded-lg">
          <input
            type="radio"
            name="faq"
            checked={openBlock === "1"}
            onChange={() => setOpenBlock("1")}
          />
          <h2 className="collapse-title text-xl md:text-2xl text-white">
            What kind of submissions does {SITE_TITLE} accept?
          </h2>
          <div className="collapse-content text-gray-300">
            <p className="mb-3">
              We accept all sorts of thoughts relating to life for single posts,
              Thoughtful Ideas, Short Stories, Poems, Non-fiction,or if you have
              something else in mind and you would like to talk more, let’s
              talk...
            </p>

            <p className="mb-3">
              {SITE_TITLE} publishes content of a specific type, and we go
              through all submissions carefully before posting. Hence we
              encourage contributors to go through our current content and get a
              taste of the type of content we post before submitting your work.{" "}
            </p>

            <p>
              <span className="text-red-400 uppercase font-bold">note: </span>
              We highly encourage original submissions, and expect our
              contributors to submit content that own complete rights to.
            </p>
          </div>
        </div>

        <div className="collapse bg-base-200 mb-3 rounded-lg">
          <input
            type="radio"
            name="faq"
            checked={openBlock === "2"}
            onChange={() => setOpenBlock("2")}
          />
          <h2 className="collapse-title text-xl md:text-2xl text-white">
            Do you accept submissions in any language or format?
          </h2>
          <div className="collapse-content text-gray-300">
            <p>
              {SITE_TITLE} is intended to be primarily in English, but we will
              definitely not skip something just because it is in a different
              language. Send in your content, irrespective of the language, and
              we will look it over definitely. As for formats, any supported
              text format is fine if it can be read on a digital media. I will
              try to respect the source formatting as closely as possible, and
              will get a review from you before actually publishing it.
            </p>
          </div>
        </div>

        <div className="collapse bg-base-200 mb-3 rounded-lg">
          <input
            type="radio"
            name="faq"
            checked={openBlock === "4"}
            onChange={() => setOpenBlock("4")}
          />
          <h2 className="collapse-title text-xl md:text-2xl text-white">
            What&rsquo;s in it for me if I post my content to {SITE_TITLE}?
          </h2>
          <div className="collapse-content text-gray-300">
            <p>
              {SITE_TITLE} is a privately owned non-profit blog.As such, as of
              today, we do not promise any rewards or compensations for
              submitting to our platform. However, if {SITE_TITLE} becomes
              profitable sometime in the future, we will not forget our
              contributors.
            </p>
          </div>
        </div>
      </div>
      <dialog ref={dialog} className="modal">
        <form
          className="modal-box"
          noValidate
          onSubmit={handleSubmit(submitIdea)}
          onReset={closeForm}
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl">Submit your content...</h2>
            <button className="btn btn-sm" onClick={closeForm}>
              <IconX size={14} />
            </button>
          </div>
          <Input
            label="Your Name"
            autoFocus
            required
            error={errors.userName?.message ?? ""}
            disabled={submitting}
            {...register("userName")}
          />
          <Input
            label="Email Address"
            required
            help="Please provide a valid email address for further communication."
            error={errors.emailId?.message ?? ""}
            disabled={submitting}
            {...register("emailId")}
          />
          <Input
            label="Title of your content."
            required
            help={`${watch("ideaTitle").length}/180 characters`}
            error={errors.ideaTitle?.message ?? ""}
            disabled={submitting}
            {...register("ideaTitle")}
          />
          <TextArea
            rows={5}
            label="Summary of yout content"
            error={errors.ideaDescription?.message ?? ""}
            className="mb-4"
            help={`${watch("ideaDescription").length}/1000 characters`}
            disabled={submitting}
            {...register("ideaDescription")}
          />
          <div className="flex gap-3 justify-end">
            <button
              type="reset"
              className="btn btn-sm btn-ghost btn-error"
              disabled={submitting}
            >
              <IconX size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-success"
              disabled={submitting}
            >
              {submitting ? <Loader /> : <IconSend size={18} />}
              Submit Idea
            </button>
          </div>
        </form>
      </dialog>
      {submitted && (
        <div className="toast font-body">
          <div className="alert alert-info p-4 flex gap-2">
            <span>
              <IconChecks size={20} />
            </span>
            <span>Idea Submitted !!</span>
          </div>
        </div>
      )}
    </>
  );
}
