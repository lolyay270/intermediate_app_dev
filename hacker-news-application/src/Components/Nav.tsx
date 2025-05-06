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
    fetchUrl: "<link to my data on top leaders>",
  },
];

export interface NavItems {
  name: string;
  localUrl: string;
  fetchUrl: string;
}

const Nav: React.FC = () => {
  return (
    <nav>
      {navItems.map((item: NavItems) => (
        <a key={item.name} href={item.localUrl}>{item.name}</a>
      ))}
    </nav>
  );
};

export default Nav;