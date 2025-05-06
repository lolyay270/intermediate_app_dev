interface NavProps {
  navItems: NavItems[];
}

export interface NavItems {
  name: string;
  localUrl: string;
  fetchUrl: string;
}

const Nav: React.FC<NavProps> = (props: NavProps) => {
  return (
    <nav>
      {props.navItems.map((item: NavItems) => (
        <a href={item.localUrl}>{item.name}</a>
      ))}
    </nav>
  );
};

export default Nav;