import { MenuIcon } from "lucide-react";

import LogoSVG from "@/assets/svgs/Logo";
import { Menu } from "@/components/Sidebar/menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button
          className="h-8 items-center justify-center"
          variant="outline"
          size="icon"
        >
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col bg-slate-950 border-0" side="left">
        <SheetHeader>
        <div className='flex items-center gap-2 h-10 px-3'>
          <LogoSVG fill={'white'} width={50} />
        <h1 className='text-xl font-bold text-white'>NEOM Networks</h1>
        </div>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
