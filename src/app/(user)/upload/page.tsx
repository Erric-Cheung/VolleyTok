"use client";

import TextInput from "@/components/Input/TextInput";
import { Upload } from "antd";
import { startTransition, useState } from "react";
import { createPost, createPresignedURL } from "@/lib/actions/posts";
import { v4 as uuidv4 } from "uuid";
import TextBox from "@/components/Input/TextBox";
import FormButton from "@/components/Input/FormButton";

type UploadError = {
  title?: string;
  file?: string;
  description?: string;
};

export default function UploadForm() {
  const [previewUrl, setPreviewUrl] = useState(null); // File URL for preview
  const [uploadedFileInfo, setUploadedFileInfo] = useState<any>(null); // Uploaded file info
  const [uploadedFile, setUploadedFile] = useState<any>(null); // Uploaded file list
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState<UploadError>({});

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
    setIsUploading(true);
    setUploadError({});

    // Client Side Validation
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    if (!uploadedFile || uploadedFile.size > maxSize) {
      setUploadError({ file: "Error uploading file. Please include a MP4 file under 50 MB" });
      setIsUploading(false);
      return;
    }

    const uuid = uuidv4();
    const formData = new FormData(e.currentTarget);
    formData.append("fileName", uploadedFileInfo.name);
    formData.append("fileSize", uploadedFileInfo.size);
    formData.append("fileType", uploadedFileInfo.type);
    formData.append("fileId", uuid);

    try {
      // Generate signed URL from server, validate
      const presignedUrlResponse = await createPresignedURL(formData);
      if (presignedUrlResponse.errors) {
        setUploadError(presignedUrlResponse.errors);
        setIsUploading(false);
        return;
      }

      // Directly uploads the file to S3 using presigned url
      const uploadResponse = await fetch(presignedUrlResponse.url, {
        method: "PUT",
        body: uploadedFile,
        headers: {
          "Content-Type": uploadedFileInfo.type,
        },
      });

      if (!uploadResponse.ok) {
        setIsUploading(false);
        return;
      }

      // Creates the post in database
      const postResponse = await createPost(formData);
      if (postResponse.success) setUploadMessage(postResponse.success);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
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
            <TextInput name="title" error={uploadError?.title}>
              TITLE
            </TextInput>
            <TextBox
              required={false}
              name="description"
              error={uploadError?.description}
            >
              DESCRIPTION
            </TextBox>
            {uploadError && (
              <p className="text-red-500 text-center">{uploadError.file}</p>
            )}
            <FormButton pending={isUploading}>Upload</FormButton>
            {uploadMessage && <p className="text-green-500 text-center">{uploadMessage}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
