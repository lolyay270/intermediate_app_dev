interface CardProps {
    name: string;
    date: string;
    posterPath: string;
    overview: string;
};

const Card: React.FC<CardProps> = (props: CardProps) => {
    return (
        <>
            <p>{props.name}</p>
            <p>{props.date}</p>
            <img src={props.posterPath}/>
            <p>{props.overview}</p>
        </>
    )
}

export default Card;
