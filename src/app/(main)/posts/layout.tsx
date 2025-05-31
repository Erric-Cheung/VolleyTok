export default function Layout({
  children,
  postModal,
  modals,
}: {
  children: React.ReactNode;
  postModal: React.ReactNode;
  modals: React.ReactNode;
}) {
  return (
    <>
      {children}
      {postModal}
      {modals}
    </>
  );
}
