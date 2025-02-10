"use client";

import TextInput from "@/components/Input/TextInput";
import UploadBox from "@/components/Upload/UploadBox";

import { Upload, Button } from "antd";
import { startTransition, useActionState, useState } from "react";
import { createPost, getPresignedURL } from "@/lib/actions/posts";
import { v4 as uuidv4 } from "uuid";
import TextBox from "@/components/Input/TextBox";
import FormButton from "@/components/Input/FormButton";

export default function UploadForm() {
  const [state, createPostAction, pending] = useActionState(createPost, null);
  const [previewUrl, setPreviewUrl] = useState(null); // File URL for preview
  const [uploadedFileInfo, setUploadedFileInfo] = useState<any>(null); // Uploaded file list
  const [uploadedFile, setUploadedFile] = useState<any>(null); // Uploaded file list
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async ({ fileList, file }: any) => {
    // Handle preview generation for the latest file
    if (fileList.length > 0) {
      const latestFile = fileList[0]; // we allow only one file
      setUploadedFileInfo(latestFile);
      setUploadedFile(file);

      if (!latestFile.url && !latestFile.preview) {
        latestFile.preview = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(latestFile.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }

      // Set the preview URL to display the file
      setPreviewUrl(latestFile.url || latestFile.preview);
    } else {
      // If no file is uploaded, clear the preview
      setPreviewUrl(null);
    }

    console.log(fileList);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uuid = uuidv4();

    if (!uploadedFile) {
      setUploadError("Please include a video file.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("fileName", uploadedFileInfo.name);
    formData.append("fileSize", uploadedFileInfo.size);
    formData.append("fileType", uploadedFileInfo.type);
    formData.append("fileId", uuid);

    const maxSize = 50 * 1024 * 1024; // Example: 50MB limit
    if (uploadedFile.size > maxSize) {
      setUploadError("Maximum allowed file size is 50MB.");
      return;
    }

    try {
      // Generate signed URL from server
      const presignedUrl = await getPresignedURL(formData);

      // Directly uploads the file to S3 using presigned url
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: uploadedFile,
        headers: {
          "Content-Type": uploadedFileInfo.type,
        },
      });

      if(uploadResponse.ok){
        console.log("Adding to DB")
        // Creates the post in database
        startTransition(() => createPostAction(formData));
      }


    } catch (error) {
      console.log(error);
      setUploadError("Error uploading the file.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      <div className="flex flex-1 flex-col p-8 self-stretch">
        <form
          className="flex flex-col lg:flex-row lg:h-full"
          onSubmit={handleSubmit}
        >
          <div className="flex-col grow">
            {previewUrl && (
              <div className="border mb-4 ">
                <video src={previewUrl} controls className="w-full h-auto" />
              </div>
            )}
            <Upload.Dragger
              name="file"
              beforeUpload={() => false}
              accept=".mp4"
              maxCount={1}
              className="flex flex-col justify-center m-16 items-stretch"
              onChange={handleChange}
            >
              <div className=""> Select or drag a file</div>
            </Upload.Dragger>
          </div>
          <div className="m-4 "></div>
          <div className="flex flex-col grow">
            <TextInput name="title" error={state?.title}>
              TITLE
            </TextInput>
            <TextBox
              required={false}
              name="description"
              error={state?.description}
            >
              DESCRIPTION
            </TextBox>
            {uploadError && <p className="text-red-500">{uploadError}</p>}
            <FormButton pending={pending}>Upload</FormButton>
          </div>
        </form>
      </div>
    </div>
  );
}
