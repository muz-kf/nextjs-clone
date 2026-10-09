import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

type PictureProps = DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
>;

export default function Picture(props: PictureProps) {
    return <img {...props} />;
}
