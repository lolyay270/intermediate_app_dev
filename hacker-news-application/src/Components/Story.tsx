export interface StoryProps {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

const Story: React.FC<StoryProps> = (props: StoryProps) => {
  return props.id;
}

export default Story;