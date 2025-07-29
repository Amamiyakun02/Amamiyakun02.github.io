import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen bg-[#d5eafd] flex items-center justify-center overflow-x-hidden">
      <main className="w-full">{children}</main>
    </div>
  )
}

export default MainLayout;
