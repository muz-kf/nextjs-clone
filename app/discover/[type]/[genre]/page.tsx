import { Movie, PaginatedResponse } from "../../../../@types";
import { default as ErrorBox } from "../../../../components/Error";
import TMDB from "../../../../server/tmdb";
import { genRandom, genTitle } from "../../../../utils";
import GenreSuggestions from "../../../[type]/[slug]/Suggestions";

type Props = {
    params: Promise<{ genre: string; type: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { genre } = await params;
    return {
        title: genTitle(`Genres - ${genre ?? 0}`),
    };
}

export default async function GetGenresSSR({ params }: Props) {
    const { genre, type } = await params;
    const ref = type === "tv" ? type : "movie";
    const page = genRandom(8);

    let data: PaginatedResponse<Movie> | null = null;
    let errorMessage: string | null = null;
    try {
        const response = await TMDB.get<PaginatedResponse<Movie>>(
            `/discover/${ref}?with_genres=${genre}&page=${page}`
        );
        data = response.data;
        if (data.results.length === 0) {
            errorMessage = `Unable to fetch ${type}(s) with ID: ${genre}`;
        }
    } catch (error) {
        console.error("Error fetching genres:", { genre, type, error });
        errorMessage =
            error instanceof Error ? error.message : "Error getting Genres!";
    }

    if (errorMessage || !data) return <ErrorBox message={errorMessage ?? undefined} />;

    return (
        <GenreSuggestions
            currentPage={page + 1}
            type={ref}
            suggestions={data.results}
            genre={genre}
        />
    );
}
