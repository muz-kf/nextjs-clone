import Error from "../../../../components/Error";
import TMDB from "../../../../server/tmdb";
import { genTitle } from "../../../../utils";
import DisplayData from "../../../get-data/Client";
import PersonPage from "./PersonPage";
import { DetailedPerson, Movie, PaginatedResponse } from "../../../../@types";
import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props):Promise<Metadata> {
    const { id } = await params;
    return {
        title: genTitle(`Person - ${id ?? 0}`),
    };
}

export default async function GetActorSSR({ params, searchParams }: Props) {
    const { page: rawPage = "1" } = await searchParams;
    const { id } = await params;
    const requestedPage =
        typeof rawPage === "string" && Number.isInteger(Number(rawPage))
            ? Math.max(1, Number(rawPage))
            : 1;
    let person: DetailedPerson | null = null;
    let data: PaginatedResponse<Movie> | null = null;
    let failed = false;

    try {
        const personResponse = await TMDB.get<DetailedPerson>(`/person/${id}`);
        person = personResponse.data;
        const movieResponse = await TMDB.get<PaginatedResponse<Movie>>(
            `/discover/movie?with_cast=${id}&page=${requestedPage}`
        );
        data = movieResponse.data;
        if (
            data.results.length === 0 &&
            requestedPage > (data.total_pages ?? 0) &&
            (data.total_pages ?? 0) > 0
        ) {
            const lastPageResponse = await TMDB.get<PaginatedResponse<Movie>>(
                `/discover/movie?with_cast=${id}&page=${data.total_pages}`
            );
            data = lastPageResponse.data;
        }
    } catch (err) {
        console.error("Error fetching actor page:", err);
        failed = true;
    }

    if (failed || !person) {
        return <Error message={`Person with ID: ${id} Not Found!`} />;
    }

    const hasRecommendations = (data?.results.length ?? 0) > 0;
    return (
        <>
            <PersonPage actor={person} />
            {hasRecommendations ? (
                <>
                    <h2 className="h4 py-2 text-center">You may also Like</h2>
                    <DisplayData
                        currentPage={2}
                        items={data?.results ?? []}
                    />
                </>
            ) : (
                <Error
                    message={`Unable to Fetch Page: ${requestedPage} \n Available Pages: ${
                        data?.total_pages ?? 0
                    }`}
                />
            )}
        </>
    );
}
