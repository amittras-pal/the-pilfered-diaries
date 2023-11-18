"use client";

import Input from "@components/form/Input";
import { SITE_TITLE } from "@constants/app";
import { auth, firestore } from "@firebase/client.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

const loginSchema = object().shape({
  email: string().email("Invalid Identity.").required("Identity is required."),
  password: string().required("Password is required."),
});

type LoginForm = InferType<typeof loginSchema>;
interface LoginProps {
  prohibited: boolean;
}

const Login = ({ prohibited }: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginSchema),
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  useEffect(() => {
    const q = query(
      collection(firestore, "logins"),
      where("success", "==", false)
    );
    return onSnapshot(q, (s) => {
      setFailedAttempts(s.docs.length);
    });
  }, []);

  const loginAdmin: SubmitHandler<LoginForm> = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      const loginQ = query(collection(firestore, "logins"));
      const logins = await getDocs(loginQ);
      const deletions = logins.docs.map((attempt) =>
        deleteDoc(doc(firestore, "logins", attempt.id))
      );
      await Promise.all(deletions);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const loginsRef = collection(firestore, "logins");
        await addDoc(loginsRef, {
          code: error.code,
          success: false,
          time: Timestamp.fromDate(new Date()),
        });
      }
    }
  };

  return (
    <div className="max-w-screen-md mx-auto my-12">
      {failedAttempts >= 5 || prohibited ? (
        <div className="w-full h-full border border-gray-700 rounded-box p-6">
          {prohibited && (
            <h2 className="text-center text-3xl text-red-400">
              You are not allowed to access this module
            </h2>
          )}
          {failedAttempts >= 5 && (
            <h2 className="text-center text-3xl text-red-400">
              This module is blocked from further access by the admin!
            </h2>
          )}
        </div>
      ) : (
        <form
          className="w-full h-full border border-gray-700 rounded-box p-6"
          onSubmit={handleSubmit(loginAdmin)}
        >
          <h3 className="text-xl text-white mb-3">
            Login with {SITE_TITLE} credentials.
          </h3>
          <p className="text-gray-400 mb-3">This is a restricted module.</p>
          <Input
            {...register("email")}
            placeholder="Identity"
            error={errors.email?.message}
            className="mb-3"
          />
          <Input
            {...register("password")}
            placeholder="Password"
            error={errors.email?.message}
            className="mb-3"
          />
          <button className="btn btn-sm btn-error">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
