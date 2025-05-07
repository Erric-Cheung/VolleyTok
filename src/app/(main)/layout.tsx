import { AntdRegistry } from "@ant-design/nextjs-registry";
import MainLayout from "@/components/UI/MainLayout";

export default async function Layout({
  children,
  modals,
}: Readonly<{
  children: React.ReactNode;
  modals: React.ReactNode;
}>) {
  return (
    <>
      <AntdRegistry>
        <MainLayout>{children}</MainLayout>
        {modals}
      </AntdRegistry>
    </>
  );
}
