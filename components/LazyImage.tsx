"use client";

import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

type Props = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

export function ImgWithSkeleton(props: Props) {
    return (
        <img
            {...props}
            className={`${props.className} load-placeholder`}
            loading="lazy"
            onLoad={({ currentTarget: el }) => el.classList.remove("load-placeholder")}
            onLoadedData={(e) => {
                console.log("onloadedData", e);
            }}
        />
    );
}
