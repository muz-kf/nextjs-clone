import Link from "next/link";

type Props = {
    searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const { q = "" } = await searchParams;
    return (
        <>
            <h2 className="text-xl">
                Results for Query: <i className="font-semibold">&quot;{q}&quot;</i>
            </h2>
            <div className="py-5 col center">
                <h4 className="text-4xl">Uh&apos;Uh.. This page is under development!</h4>
                <Link className="genre-button" href={"/"}>
                    Home
                </Link>
            </div>
        </>
    );
}
