import { Metadata } from "next";
import { Movie, PaginatedResponse } from "../../@types";
import ErrorBox from "../../components/Error";
import { tmdb } from "../../server/tmdb";
import { genRandom, genTitle } from "../../utils";
import DisplayData from "./Client";

export const metadata :Metadata = {
    title: genTitle("Popular Movies"),
};

export default async function GetData() {
    const page = genRandom(24);
    const rev = 60 * 60;
    let data: PaginatedResponse<Movie> | null = null;
    let errorMessage: string | undefined;

    try {
        const response = await fetch(
            `${tmdb.getBaseURL()}/movie/popular?page=${page}&${tmdb.getApiKey()}`,
            {
                next: {
                    tags: ["popular"],
                    revalidate: rev * 24,
                },
            }
        );
        if (!response.ok)
            throw new globalThis.Error(`Request failed: ${response.status}`);
        data = (await response.json()) as PaginatedResponse<Movie>;
    } catch (error) {
        console.error(`Error fetching popular movies (page ${page}):`, error);
        errorMessage =
            error instanceof globalThis.Error
                ? error.message
                : "Error Fetching Data!";
    }

    if (errorMessage || !data) return <ErrorBox message={errorMessage} />;
    return <DisplayData items={data.results} currentPage={page + 1} />;
}
