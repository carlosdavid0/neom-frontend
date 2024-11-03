import { Home, IdCard, Key, LucideIcon, ServerIcon, User2 } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  className?: string;
  external?: boolean;
};

type Group = {
  groupLabel: string;
  className?: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const menuList: Group[] = [
    {
      groupLabel: "Geral",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          active: pathname.includes("/"),
          icon: Home,
          submenus: [],
        },
        {
          href: "/",
          label: "Users",
          active: pathname.includes("/users"),
          icon: User2,
          submenus: [],
        },
        {
          href: "/",
          label: "Roles",
          active: pathname.includes("/roles"),
          icon: IdCard,
          submenus: [],
        },
        {
          href: "/",
          label: "Permissions",
          active: pathname.includes("/permissions"),
          icon: Key,
          submenus: [],
        },
        {
          href: "/",
          label: "OLTs",
          active: pathname.includes("/olts"),
          icon: ServerIcon,
          submenus: [],
        },
       
       
      ],
    },
  ];

 

  return menuList;
}
