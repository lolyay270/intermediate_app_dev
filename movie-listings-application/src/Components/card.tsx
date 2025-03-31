export interface MovieProps {
    id: number;
    name: string;
    date: string;
    posterPath: string;
    overview: string;
};

const Movie: React.FC<MovieProps> = (props: MovieProps) => {
    return (
        <>
            <p>{props.name}</p>
            <p>{props.date}</p>
            <img src={props.posterPath} />
            <p>{props.overview}</p>
        </>
    )
}

export default Movie;
