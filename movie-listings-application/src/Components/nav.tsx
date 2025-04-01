interface NavProps {
  navItems: NavItems[]
};

export interface NavItems {
  name: string;
  localUrl: string;
  fetchUrl: string;
}

const Nav: React.FC<NavProps> = (props: NavProps) => {
  const changeFetchUrl = () => {
    	// remove current info
      // fetch new info
  }

  return (
    props.navItems.map((item: NavItems) => (
      <a href={item.localUrl} > 
        <button onClick={changeFetchUrl}>{item.name}</button>
      </a>
    ))
  );
};

export default Nav;