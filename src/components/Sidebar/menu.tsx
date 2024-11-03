import { CollapseMenuButton } from "@/components/Sidebar/collapse-menu-button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMenuList } from "@/constants/menu-list";
import { cn } from "@/lib/utils";
import { Ellipsis, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = useLocation().pathname;
  const menuList = getMenuList(pathname);

  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col flex-grow mt-5">
        <ul className="flex flex-col flex-grow items-start space-y-1 px-2 overflow-hidden">
          {menuList.map(({ groupLabel, menus, className }, index) => (
            <li
              className={cn("w-full", groupLabel ? "pt-5" : "", className)}
              key={index}
            >
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                (
                  {
                    href,
                    label,
                    icon: Icon,
                    active,
                    submenus,
                    className,
                  },
                  index
                ) => (
                  <div className="w-full" key={index}>
                    {submenus.length === 0 ? (
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start h-10 mb-1",
                                active ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-transparent text-white hover:bg-gray-700 hover:text-white",
                                className
                              )}
                              asChild
                            >
                              <Link
                                to={href}
                                className="flex items-center w-full p-2 cursor-pointer"
                              >
                                <div className="flex items-center w-full relative">
                                
                                  <span
                                    className={cn(
                                      isOpen === false ? "" : "mr-4"
                                    )}
                                  >
                                    <Icon size={18} />
                                  </span>
                                  <p
                                    className={cn(
                                      "text-md", 
                                      "max-w-[200px] truncate",
                                      isOpen === false
                                        ? "-translate-x-96 opacity-0"
                                        : "translate-x-0 opacity-100"
                                    )}
                                  >
                                    {label}
                                  </p>
                                </div>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    )}
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
        <div className="mt-auto w-full px-2">
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  // onClick={signOut}
                  variant="outline"
                  className="w-full"
                >
                  <span className={cn(isOpen === false ? "" : "mr-4")}>
                    <LogOut size={18} />
                  </span>
                  <p
                    className={cn(
                      "whitespace-nowrap",
                      isOpen === false ? "opacity-0 hidden" : "opacity-100"
                    )}
                  >
                    Deslogar
                  </p>
                </Button>
              </TooltipTrigger>
              {isOpen === false && (
                <TooltipContent side="right">Deslogar</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </div>
  );
}
