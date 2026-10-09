"use client";

import { useCallback, useRef, useState } from "react";
import { Movie, PaginatedResponse } from "../../@types";
import MovieCard from "../../components/MovieCard";
import Loader from "../loading";

type Props = {
    items: Movie[] | null;
    currentPage?: number;
};

export default function DisplayData({ items, currentPage = 2 }: Props) {
    const [data, setData] = useState<Movie[]>(items ?? []);
    const [loading, setLoading] = useState(false);
    const page = useRef(currentPage);
    const observer = useRef<IntersectionObserver>();

    const lastItem = useCallback((node: HTMLDivElement) => {
        if (loading) return; // loading state
        observer.current?.disconnect();
        observer.current = new IntersectionObserver(
            async ([entry]) => {
                if (entry?.isIntersecting) {
                    setLoading(true);
                    const values = await getMore(page.current);
                    if (!values || values.results.length === 0) {
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
    }, [loading]);

    return (
        <section className="relative flex flex-col gap-3 items-center justify-center">
            <main className="items-center m-2 p-2 flex flex-row gap-2 flex-wrap justify-center">
                {data?.map((movie, i) => {
                    if (data?.length === i + 1) {
                        return (
                            <div key={movie?.id} ref={lastItem}>
                                <MovieCard movie={movie} />
                            </div>
                        );
                    } else return <MovieCard movie={movie} key={movie?.id} />;
                })}
            </main>
            <div className="py-4">{loading && <Loader />}</div>
        </section>
    );
}

async function getMore(page: number): Promise<PaginatedResponse<Movie> | null> {
    try {
        const response = await fetch(
            `/api/v1/get-data?type=movie&cat=popular&page=${page}`
        );
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return (await response.json()) as PaginatedResponse<Movie>;
    } catch (error) {
        console.error("Error fetching popular movies:", { page, error });
        return null;
    }
}
