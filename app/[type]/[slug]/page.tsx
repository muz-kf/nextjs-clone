import { Metadata } from "next";
import { Crew, DetailedMovie, Movie, PaginatedResponse, Person } from "../../../@types";
import Error from "../../../components/Error";
import TMDB from "../../../server/tmdb";
import { genRandom, genTitle } from "../../../utils";
import GenreSuggestions from "./Suggestions";
import ViewSingle from "./ViewSingle";

export const metadata :Metadata = { title: genTitle("Info") };

type Props = {
    params: Promise<{ slug: string; type: string }>;
};

export default async function Page({ params }: Props) {
    const { slug, type: routeType } = await params;
    const type = routeType === "tv" ? "tv" : "movie";

    const movie = await getData(
        TMDB.get<DetailedMovie>(
            `/${type}/${slug ?? 14325}?append_to_response=videos,credits`
        ),
        slug
    );
    if (!movie) return <Error />;

    if (movie.credits) {
        movie.credits.cast = uniqueById(movie.credits.cast ?? []);
        movie.credits.crew = uniqueById(movie.credits.crew ?? []);
    }

    const genre = movie?.genres?.[0]?.id ?? 35;
    const page = genRandom(4);

    const suggestions = await getData(
        TMDB.get<PaginatedResponse<Movie>>(
            `/discover/${type}?with_genres=${genre}&page=1`
        ),
        genre
    );

    return (
        <>
            <ViewSingle movie={movie} type={type} />
            {!suggestions ? (
                <Error message="Unable to Fetch Suggestions!" />
            ) : (
                <GenreSuggestions
                    currentPage={page + 1}
                    type={type}
                    suggestions={suggestions?.results ?? []}
                    genre={genre}
                />
            )}
        </>
    );
}

function uniqueById<T extends Crew | Person>(items: T[]): T[] {
    return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

async function getData<T>(
    request: Promise<{ data: T }>,
    slug: string | number
): Promise<T | null> {
    try {
        const { data } = await request;
        return data;
    } catch (err) {
        console.log("Error fetching SLUG/GENRE: ", slug, ":", err);
        return null;
    }
}

/** @param { /movie/${id}?append_to_response=videos,credits&api_key=${API_KEY} } */
