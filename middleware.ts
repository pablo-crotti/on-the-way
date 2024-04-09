export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/", "/entry/:path*", "/calendar/:path*", "/account/:path*"],
};