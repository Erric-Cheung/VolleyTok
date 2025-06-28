import type { Metadata } from "next";
import "./globals.css";
import HistoryTracker from "@/components/Utility/HistoryTracker";
import { ModalProvider } from "@/components/Utility/ModalContext";
import ModalRoot from "@/components/Modals/RootModal";

export const metadata: Metadata = {
  title: "VolleyTok",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <ModalProvider>
          {children}
          <ModalRoot></ModalRoot>
        </ModalProvider>
        <div id="modal" />
      </body>
      <HistoryTracker></HistoryTracker>
    </html>
  );
}
