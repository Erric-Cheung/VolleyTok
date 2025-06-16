const MenuHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex mx-4 mb-4 py-4 ">
      <div className="font-bold text-xl grow">{title}</div>
    </div>
  );
};

export default MenuHeader;
