import UploadForm from "@/components/Upload/UploadForm";

export default async function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <UploadForm></UploadForm>
      </main>
    </div>
  );
}
