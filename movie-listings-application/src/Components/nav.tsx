import { NavLink } from "react-router";

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
    <nav>
      <ul>
        {props.navItems.map((item: NavItems) => (
          <li>
            <NavLink to={item.localUrl}>{item.name}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;