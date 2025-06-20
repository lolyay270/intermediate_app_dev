import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu"
import { Button } from "./ui/button";

export interface NavItems {
  name: string;
  localUrl: string;
  fetchUrl: string;
}

export const navItems: NavItems[] = [
  {
    name: "Ask Stories",
    localUrl: "/ask",
    fetchUrl: "/askstories.json",
  },
  {
    name: "Best Stories",
    localUrl: "/best",
    fetchUrl: "/beststories.json",
  },
  {
    name: "Job Stories",
    localUrl: "/job",
    fetchUrl: "/jobstories.json",
  },
  {
    name: "New Stories",
    localUrl: "/new",
    fetchUrl: "/newstories.json",
  },
  {
    name: "Show Stories",
    localUrl: "/show",
    fetchUrl: "/showstories.json",
  },
  {
    name: "Top Stories",
    localUrl: "/top",
    fetchUrl: "/topstories.json",
  },
  {
    name: "Leaders",
    localUrl: "/leaders",
    fetchUrl: "", //value is unneeded since there is no fetch
  },
];

const Nav: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>

        {navItems.map((item: NavItems) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink>
              <Button className="bg-sky-500/50">
                <NavLink to={item.localUrl}>
                  {item.name}
                </NavLink>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Nav;
