import { AntdRegistry } from "@ant-design/nextjs-registry";
import MainLayout from "@/components/UI/MainLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AntdRegistry>
        <MainLayout>{children}</MainLayout>
      </AntdRegistry>
    </>
  );
}
