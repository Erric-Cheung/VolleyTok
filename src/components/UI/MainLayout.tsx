"use server";

import { getCurrentUser } from "@/lib/data/user";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  console.log("MAIN LAYOUT RERENDER");
  return (
    <main className="flex flex-grow min-h-screen">
      <div className="flex flex-1">
        <Sidebar user={user}></Sidebar>
        <div className="flex-1 h-full">
          {/* <Header></Header> */}
          {children}
        </div>
      </div>
    </main>
  );
};
export default MainLayout;
