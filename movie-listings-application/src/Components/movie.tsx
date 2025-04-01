import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
            <Card>
                <CardHeader>
                    <CardTitle>
                        <p>{props.name}</p>
                    </CardTitle>
                    <CardDescription>
                        <p>{props.date}</p>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <img src={props.posterPath} />
                </CardContent>
                <CardFooter>
                    <p>{props.overview}</p>
                </CardFooter>
            </Card>
        </>
    )
}

export default Movie;
