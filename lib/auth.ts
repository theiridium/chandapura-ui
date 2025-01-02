import NextAuth, { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import { userAuthentication } from "./apiLibrary";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
const authOptions = {
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
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
                    // return res.user
                    return {
                        firstname: res.user.firstname,
                        name: res.user.firstname + res.user.lastname,
                        email: res.user.email,
                        phone: res.user.phone,
                        id: res.user.id.toString(),
                        strapiUserId: res.user.id.toString(),
                        blocked: res.user.blocked,
                        strapiToken: res.jwt,
                    };
                }
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                  prompt: "login",
                  access_type: "online",
                  response_type: "code"
                }
              }
        
        })
    ],
    callbacks: {
        async jwt({ user, token, account, trigger, session }: any) {
            if (user) {  // Note that this if condition is needed
                token.user = { ...user }
            }
            // change username update
            if (trigger === 'update' && session?.username) {
                token.name = session.username;
            }

            // change password update
            if (trigger === 'update' && session?.strapiToken) {
                token.strapiToken = session.strapiToken;
            }
            if (account) {
                if (account.provider === 'google') {
                    var errorMessage = "";
                    // we now know we are doing a sign in using GoogleProvider
                    try {
                        const strapiResponse = await fetch(
                            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/${account.provider}/callback?access_token=${account.access_token}`,
                            { cache: 'no-cache' }
                        );
                        if (!strapiResponse.ok) {
                            const strapiError: any = await strapiResponse.json();
                            console.log('strapiError', strapiError);
                            errorMessage = strapiError.error.message;
                        }
                        const strapiLoginResponse: any =
                            await strapiResponse.json();
                        // customize token
                        // name and email will already be on here
                        token.firstname = strapiLoginResponse.user.firstname;
                        token.phone = strapiLoginResponse.user.phone;
                        token.strapiToken = strapiLoginResponse.jwt;
                        token.strapiUserId = strapiLoginResponse.user.id;
                        token.provider = account.provider;
                        token.blocked = strapiLoginResponse.user.blocked;
                        token.errorMessage = errorMessage;
                    } catch (error) {
                        throw error;
                    }
                }
                if (account.provider === 'credentials') {
                    // for credentials, not google provider
                    // name and email are taken care of by next-auth or authorize
                    token.firstname = user.firstname
                    token.phone = user.phone
                    token.strapiToken = user.strapiToken;
                    token.strapiUserId = user.strapiUserId;
                    token.provider = account.provider;
                    token.blocked = user.blocked;
                }
            }
            return token
        },
        async session({ session, token }: any) {
            if (token?.user) { // Note that this if condition is needed
                session.user.firstname = token.firstname;
                session.user.phone = token.phone;
                session.strapiToken = token.strapiToken;
                session.provider = token.provider;
                session.user.strapiUserId = token.strapiUserId;
                session.user.blocked = token.blocked;
                session.user.errorMessage = token.errorMessage;
            }
            return session
        },
        async signIn({ user, account, profile, email, credentials }: any) {
            if (account.provider === 'google') {
                try {
                    const strapiResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/${account.provider}/callback?access_token=${account.access_token}`,
                        { cache: 'no-cache' }
                    );
                    if (!strapiResponse.ok) {
                        const strapiError = await strapiResponse.json();
                        // Redirect to login with error message
                        throw new Error(strapiError.error.message);
                    }
                } catch (error: any) {
                    // Redirect to login with error message
                    return `/login?error=${encodeURIComponent(error.message)}`;
                }
            }
            return true;
        },
    },
}

function auth(  // <-- use this function to access the jwt from React components
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions)
}

export { authOptions, auth }