export default function Layout({
  children,
  postModal,
}: {
  children: React.ReactNode;
  postModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {postModal}
    </>
  );
}
