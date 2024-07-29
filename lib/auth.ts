import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import { getPublicApiResponse, userAuthentication } from "./interceptor";
export const authOptions = {
    pages: {
        signIn: '/login'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email ID", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                const user: User.Login = {
                    identifier: credentials?.email,
                    password: credentials?.password
                }
                const res = await userAuthentication(user);
                if (res.user) {
                    return res.user
                }
                return null
            }
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        //   })
    ],
    callbacks: {
        async jwt({ user, token }: any) {
            if (user) {  // Note that this if condition is needed
                token.user = { ...user }
            }
            return token
        },
        async session({ session, token }: any) {
            if (token?.user) { // Note that this if condition is needed
                session.user = token.user;
            }
            return session
        },
    },
}
export default NextAuth(authOptions)