import UploadForm from "@/components/Upload/UploadBox";

export default async function Home() {
  return (
    <div className="items-center justify-items-center min-h-[calc(100vh-60px)] font-[family-name:var(--font-geist-sans)]">
      <UploadForm></UploadForm>
    </div>
  );
}
