import styled from "styled-components";

type HandledTextProps = {
    maxlines?: number;
};

export const HandledText = styled.p<HandledTextProps>`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-wrap: break-word;
    -webkit-line-clamp: ${(props) => props.maxlines ?? 2};
    -webkit-box-orient: vertical;
`;

/**
 * @param {`/person/${id}`}
 * @param {`/discover/movie?with_cast=${id}&page=${page}`}
 * @see ---
 * @param {`/discover/movie?with_cast=${id}&page=1`}
 * */
