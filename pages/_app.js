import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
body{
  background-color: #eee;
  padding: 0;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
hr{
  display: block;
  border: 0;
  border-top: 1px solid #bbb;
}
`;

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    (function (d, m) {
      var kommunicateSettings =
        { "appId": "341ac6a4307f72c368397be3061728eb0", "popupWidget": true, "automaticChatOpenOnNavigation": true };
      var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }, [])
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  )
}
