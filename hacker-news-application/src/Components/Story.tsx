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
  return (
    <>
      <p>{props.by}</p>
      <p>{props.descendants}</p>
      <p>{props.id}</p>
      <p>{props.kids}</p>
      <p>{props.score}</p>
      <p>{props.time}</p>
      <p>{props.title}</p>
      <p>{props.type}</p>
      <p>{props.url}</p>
    </>
  );
}

export default Story;