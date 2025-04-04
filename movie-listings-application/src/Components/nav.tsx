import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu.tsx"


interface NavProps {
  navItems: NavItems[]
};

export interface NavItems {
  name: string;
  localUrl: string;
  fetchUrl: string;
}

const Nav: React.FC<NavProps> = (props: NavProps) => {
  return (
    <NavigationMenu className="inline w-screen m-1 place-self-center">
      <NavigationMenuList>
        {props.navItems.map((item: NavItems) => (
          <NavigationMenuItem>
            <NavLink className='inline-flex rounded-md bg-slate-50 px-4 py-2 text-2xl' to={item.localUrl}>{item.name}</NavLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Nav;