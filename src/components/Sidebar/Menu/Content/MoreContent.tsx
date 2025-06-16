import MenuHeader from "../MenuHeader";
import MenuLink from "../MenuLink";

const MoreContent = () => {
  return (
    <>
      <MenuHeader title="More"></MenuHeader>
      <div className="flex flex-col gap-1">
        <MenuLink title="Settings" href="/settings"></MenuLink>
        <MenuLink
          title="Log out"
          href="/auth/logout"
          external={true}
        ></MenuLink>
        {/* <MenuLink
            title="Dark mode"
            href="/"
            ></MenuLink> */}
      </div>
    </>
  );
};

export default MoreContent;
