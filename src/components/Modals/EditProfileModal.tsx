"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextBox from "../Input/TextInput/TextBox";
import ControlledTextInput from "../Input/ControlledInput/ControlledTextInput";
import { updateUser } from "@/lib/actions/user";
import BackButton from "../Input/Buttons/BackButton";
import { useNavigate } from "@/lib/utils/useNavigate";
import Button from "../UI/Button";
import { UserError } from "@/lib/types/types";
import ControlledTextBox from "../Input/ControlledInput/ControlledTextBox";

const EditProfileModal = ({
  username,
  bio,
}: {
  username: string;
  bio: string;
}) => {
  const router = useRouter();
  const { back } = useNavigate();
  const [serverErrors, setServerErrors] = useState<UserError | null>({});
  const [currentUsername, setUsername] = useState(username);
  const [currentBio, setBio] = useState(bio ? bio : "");
  const [bioLength, setBioLength] = useState(bio?.length | 0);
  const [isChanged, setIsChanged] = useState(false);

  const MAX_BIO_LENGTH = 80;

  const backHandler = () => {
    back();
  };

  // Handle back on escape button
  useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        back();
      }
    };
    window.addEventListener("keydown", onKeyDownHandler);

    return () => window.removeEventListener("keydown", onKeyDownHandler);
  }, [router]);

  // Check if values have changed from the original
  useEffect(() => {
    const hasChanged = currentUsername !== username || currentBio !== bio;
    setIsChanged(hasChanged);
  }, [currentUsername, currentBio, username, bio]);

  const usernameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const bioChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (bioLength >= MAX_BIO_LENGTH) {
      return;
    }
    setBio(e.currentTarget.value);
    setBioLength(e.currentTarget.value.length);
  };

  const submitHandler = async () => {
    setServerErrors(null);
    const formData = new FormData();
    if (!isChanged) return;
    if (currentUsername !== username)
      formData.append("username", currentUsername);
    if (currentBio !== bio) formData.append("bio", currentBio);

    const result = await updateUser(formData);
    console.log(result);
    if (result.errors) {
      setServerErrors(result.errors);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div
        className="bg-white w-full h-full sm:w-[600px] sm:h-[650px] rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center  border-b px-8 ">
          <div className="flex flex-1 min-w-0 font-bold h-[60px] text-center items-center">
            <h2 className="truncate text-ellipsis text-xl">Edit profile</h2>
          </div>
          <div className="shrink-0">
            <BackButton></BackButton>
          </div>
        </div>

        <div className="px-8 pt-4">
          <div className="">
            <ControlledTextInput
              value={currentUsername}
              label="Username"
              placeholder="Username"
              onChangeHandler={usernameChangeHandler}
              error={serverErrors?.username}
            ></ControlledTextInput>
          </div>
          <div className="">
            <ControlledTextBox
              value={currentBio}
              label="Bio"
              placeholder="Bio"
              onChangeHandler={bioChangeHandler}
              error={serverErrors?.bio}
              maxLength={MAX_BIO_LENGTH}
              bioLength={bioLength}
            ></ControlledTextBox>
          </div>
          <div className="flex justify-end">
            <div className="mr-4">
              <Button onClick={backHandler}>Cancel</Button>
            </div>
            <div className="">
              <Button onClick={submitHandler} disabled={!isChanged} color="">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
