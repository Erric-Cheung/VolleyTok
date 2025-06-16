import BackButton from "../../Input/Buttons/BackButton";
import ActivityContent from "./Content/ActivityContent";
import MoreContent from "./Content/MoreContent";

interface menuProps {
  menu: "none" | "Activity" | "More";
  menuIsOpen: boolean;
  closeMenu: () => void;
}

const RootMenu = ({ menu, menuIsOpen, closeMenu }: menuProps) => {
  return (
    <div
      className={`
        fixed top-0 left-[56px] h-full w-[320px] bg-white border-l shadow-lg z-30
        transition-transform duration-700 ease-initial 
        ${menuIsOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none "}
      `}
      style={{
        transitionBehavior: "allow-discrete",
      }}
    >
      {menu === "Activity" && <ActivityContent />}
      {menu === "More" && <MoreContent />}
      <div className="absolute top-6 right-4">
        <BackButton onClick={closeMenu} />
      </div>
    </div>
  );
};

export default RootMenu;
