import { AntdRegistry } from "@ant-design/nextjs-registry";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <AntdRegistry>{children}</AntdRegistry>
    </>
  );
}
