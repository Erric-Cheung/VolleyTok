"use server";

import { getCurrentUser } from "@/lib/data/user";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  console.log("MAIN LAYOUT RERENDER");
  return (
    <main className="flex flex-grow h-screen overflow-hidden">
      <div className="flex flex-1">
        <Sidebar user={user}></Sidebar>
        <div className="flex-1 overflow-y-auto">
          {/* <Header></Header> */}
          {children}
        </div>
      </div>
    </main>
  );
};
export default MainLayout;
