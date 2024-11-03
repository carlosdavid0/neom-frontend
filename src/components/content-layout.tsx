import { Navbar } from "./Sidebar/navbar";

interface ContentLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function ContentLayout({
  children,
  title,
}: ContentLayoutProps) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar title={title} />
      <div className="container px-4 sm:px-8 w-full max-w-[2100px] flex flex-col flex-1 my-5">
        {children}
      </div>
    </div>
  );
}
