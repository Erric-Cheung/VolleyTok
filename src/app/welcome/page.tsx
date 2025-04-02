"use client";

import { createUser } from "@/lib/actions/user";
import { UserError } from "@/lib/types/types";
import { usernameSchema } from "@/lib/types/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Displayed page to create username if non existing
// redirect if already created in middleware?
// redirect if not logged in?

export default function WelcomePage() {
  const [serverErrors, setServerErrors] = useState<UserError>({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(usernameSchema) });

  const onSubmit = async (data: any) => {
    setServerErrors({});
    const formData = new FormData();
    formData.append("username", data.username);

    const result = await createUser(formData);
    if (result.errors) {
      setServerErrors(result.errors);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-center p-8 mt-24 ">
      <div className="m-4">
        <h1 className="text-4xl mb-4 font-bold">Welcome to VolleyTok!</h1>
        <div>Before you get started, please enter a username.</div>
      </div>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full mb-4 max-w-96">
          <input
            {...register("username")}
            className={`border w-full text-center p-2 mb-2 rounded outline-none  ${
              errors.username || serverErrors.username ? "border-red-500" : ""
            }`}
            type="text"
            name="username"
          ></input>
          <div className="text-center ">
            {errors.username && (
              <p className="text-red-500 " aria-live="polite">
                {errors.username?.message}
              </p>
            )}
            {serverErrors.username && (
              <p className="text-red-500 " aria-live="polite">
                {serverErrors.username}
              </p>
            )}
          </div>
        </div>
        <button className="border pt-2 pb-2 pr-4 pl-4 rounded" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}
