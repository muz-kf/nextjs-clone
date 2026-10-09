"use client";
import { useCallback, useRef, useState } from "react";
import { Movie, PaginatedResponse } from "../../../@types";
import API from "../../../api";
import MovieCard from "../../../components/MovieCard";
import Loader from "../../loading";

type Props = {
    suggestions: Movie[];
    genre: number | string;
    type: "movie" | "tv";
    currentPage?: number;
    title?: string;
};

export default function GenreSuggestions({
    suggestions,
    title = "Similar Suggestions",
    genre,
    type,
    currentPage = 2,
}: Props) {
    const [data, setData] = useState<Movie[]>(suggestions);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const page = useRef(currentPage);
    const observer = useRef<IntersectionObserver | null>(null);

    const lastItem = useCallback((node: HTMLDivElement | null) => {
        if (loading) return; // loading state
        observer.current?.disconnect();
        observer.current = new IntersectionObserver(
            async (entries) => {
                if (entries[0]?.isIntersecting) {
                    setLoading(true);
                    const values = await getMore({
                        genre,
                        page: page.current,
                        type,
                    });
                    if (!values || values.results.length === 0) {
                        setFinished(true);
                        setLoading(false);
                        return;
                    }
                    setData((current) => [...current, ...values.results]);
                    page.current++;
                    setLoading(false);
                }
            },
            { rootMargin: "400px" }
        );
        if (node) observer.current.observe(node);
    }, [genre, loading, type]);
    return (
        <section className="col center pb-12">
            <h2 className="h4 font-bold text-center mb-2 mt-4">{title}</h2>
            <div className="row center">
                {data?.map((movie, i) => {
                    if (data.length === i + 1) {
                        return (
                            <div key={movie?.id} ref={lastItem}>
                                <MovieCard movie={movie} />
                            </div>
                        );
                    } else return <MovieCard key={movie?.id} movie={movie} />;
                })}
            </div>
            {loading && <Loader />}
            {finished && <h2 className="h4 font-black">End of Section!</h2>}
        </section>
    );
}
type params = {
    genre: string | number;
    page: number;
    type: "movie" | "tv";
};

async function getMore({
    genre,
    type,
    page,
}: params): Promise<PaginatedResponse<Movie> | null> {
    try {
        const { data } = await API.get<PaginatedResponse<Movie>>(
            `/get-genres?type=${type}&genre=${genre}&page=${page}`
        );
        return data;
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return null;
    }
}
