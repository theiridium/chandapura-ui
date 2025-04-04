"use client"
import { HeroUIProvider } from "@heroui/react"
import { Provider, useSetAtom } from "jotai";
import useScreenSize from "./hooks/useScreenSize";
// import { screenParameters } from "@/lib/atom";
import Header from "./components/header";
import Footer from "./components/footer";
import { myStore } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

const Wrapper = ({
  children, session
}: Readonly<{
  children: React.ReactNode, session: any
}>) => {
  // const setScreenParameters = useSetAtom<any>(screenParameters);
  // setScreenParameters(useScreenSize());
  return (
    <SessionProvider session={session}>
      <HeroUIProvider validationBehavior="native">
        <Provider store={myStore}>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Header />
          <div>{children}</div>
          {/* WhatsApp Icon */}
          <div className="w-fit fixed bottom-1 mb-1 right-0 ml-auto">
            <a aria-label="Chat on WhatsApp" target="_blank" href="https://wa.me/9739004545?text=Hi%2C%20I%27m%20looking%20for%20a%20support%20from%20Chandapura.com"> <img className="h-12 w-12 md:h-16 md:w-16 mr-1 mb-1" alt="Chat on WhatsApp" src="/images/icons/WhatsApp.svg" /></a>
          </div>
          <Footer />
        </Provider>
      </HeroUIProvider>
    </SessionProvider>
  )
}

export default Wrapper