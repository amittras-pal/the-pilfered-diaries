"use client";

import { SITE_TITLE } from "@constants/app";
import { auth } from "@firebase/client.config";
import { IconBrandGoogle } from "@tabler/icons-react";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { InferType, object, string } from "yup";

const subscriptionSchema = object().shape({
  email: string()
    .email("Please enter a valid email ID.")
    .required("Please enter an Email ID."),
  name: string().required("Please provide your name."),
});

type SubscriptionForm = InferType<typeof subscriptionSchema>;

type SubscriptionConfigProps = {
  inModal?: boolean;
};

export default function SubscriptionForm(props: SubscriptionConfigProps) {
  const [user, setUser] = useState<User | null>(null);
  const subscribe: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <>
      {props.inModal ? (
        <button className="btn btn-sm btn-ghost mt-3" onClick={subscribe}>
          <IconBrandGoogle size={18} />
          Subscribe with Google
        </button>
      ) : (
        <>
          <div className="mb-3">
            <h4 className={`text-xl text-${user ? "green" : "red"}-300`}>
              {user ? "You are Subscribed!" : "Follow for More..."}
            </h4>
            {user ? (
              <p className="text-sm">
                You are receiving our monthly newletter on your email{" "}
                <span className="text-gray-200">{user.email}</span>
              </p>
            ) : (
              <p className="text-sm">
                Subscribe to the monthly newletter from {SITE_TITLE} to stay
                updated of new single posts, stories and new chapters to your
                favorite ongoing stories.
              </p>
            )}
            {!user && (
              <button className="btn btn-sm btn-ghost mt-3" onClick={subscribe}>
                <IconBrandGoogle size={18} />
                Subscribe with Google
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
