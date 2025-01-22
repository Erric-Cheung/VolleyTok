"use client";

import { createUser } from "@/lib/actions/user";
import { useActionState } from "react";

// Displayed page to create username if non existing
// redirect if already created in middleware?
// redirect if not logged in?

// if session username already exists?
const initialState = {
  message: "",
};

// Page doesnt need SEO, client side fetching
export default function NewUser() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <div className="flex flex-col text-center">
      <div className="m-8">
        <h2 className="">Welcome to VolleyTok!</h2>
        <div>Before you get started, please enter a username.</div>
      </div>
      <form
        className="flex flex-col justify-center items-center"
        action={formAction}
      >
        <input
          className="border w-full max-w-96 text-center p-2 mb-2 rounded"
          type="text"
          name="username"
        ></input>
        <p className="mb-4" aria-live="polite">
          {state?.message}
        </p>
        <button
          className="border pt-2 pb-2 pr-4 pl-4 rounded"
          type="submit"
          disabled={pending}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
