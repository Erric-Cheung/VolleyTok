import { AntdRegistry } from "@ant-design/nextjs-registry";
import { getCurrentUser } from "@/lib/data/user";
import { auth0 } from "@/lib/auth0";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const session = await auth0.getSession();

  return (
    <>
      <AntdRegistry>{children}</AntdRegistry>
    </>
  );
}
