import { Movie, PaginatedResponse } from "../../@types";
import ErrorBox from "../../components/Error";
import Row from "../../components/Row";
import { populate } from "../../contstants";
import TMDB from "../../server/tmdb";
import { genTitle } from "../../utils";

export const metadata = {
    title: genTitle("Home"),
};

export default async function HomePage() {
    let movies: Movie[] | undefined;
    let errorMessage: string | undefined;
    try {
        const { data } =
            await TMDB.get<PaginatedResponse<Movie>>(populate.trending);
        movies = data.results;
    } catch (error) {
        console.error("Error fetching /home:", error);
        errorMessage =
            error instanceof globalThis.Error
                ? error.message
                : "Error Fetching Data!";
    }

    if (errorMessage || !movies) return <ErrorBox message={errorMessage} />;
    return (
        <section className="px-1 py-4">
            {[...Array(6)].map((_, i) => (
                <Row key={i} movies={movies} title="Trending" />
            ))}
        </section>
    );
}
