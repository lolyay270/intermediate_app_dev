export interface NavProps {
  navItems: NavItems[]
};

interface NavItems {
  name: string;
  url: string;
}

const Nav: React.FC<NavProps> = (props: NavProps) => {
  return (
    props.navItems.map((item: NavItems) => (
      <a href={
        item.url}>{item.name}</a>
    ))
  );
};

export default Nav;