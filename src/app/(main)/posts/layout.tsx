export default function Layout({
  children,
  postModal,
}: Readonly<{
  children: React.ReactNode;
  postModal: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {postModal}
    </>
  );
}
