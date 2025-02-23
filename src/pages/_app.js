import Defaults from "../components/defaults";
import "../global.css";
import HomePanel from "../components/homePanel/homePanel";
import { GlobalComponentsProvider } from "../components/globalComponentsCotext/globalComponentsContext";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

  return (
    <>
      <Defaults />
      <HomePanel />
      <GlobalComponentsProvider>
        <Component {...pageProps} />
      </GlobalComponentsProvider>
    </>
  );
}
