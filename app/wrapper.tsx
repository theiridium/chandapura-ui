"use client"
import { NextUIProvider } from "@nextui-org/react"
import { Provider, useSetAtom } from "jotai";
import useScreenSize from "./hooks/useScreenSize";
// import { screenParameters } from "@/lib/atom";
import Header from "./components/header";
import Footer from "./components/footer";
import { myStore } from "@/lib/store";
import { SessionProvider } from "next-auth/react";

const Wrapper = ({
  children, session
}: Readonly<{
  children: React.ReactNode, session: any
}>) => {
  // const setScreenParameters = useSetAtom<any>(screenParameters);
  // setScreenParameters(useScreenSize());
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <Provider store={myStore}>
          <Header />
          <div>{children}</div>
          <Footer />
        </Provider>
      </NextUIProvider>
    </SessionProvider>
  )
}

export default Wrapper