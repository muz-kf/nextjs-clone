/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "image.tmdb.org", pathname: "/**" },
            { protocol: "https", hostname: "cdn.arabsstock.com", pathname: "/**" },
            { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
        ],
    },
};
