import Defaults from "../components/defaults";
import "../global.css";
import HomePanel from "../components/homePanel/homePanel";
import { GlobalComponentsProvider } from "../components/globalComponentsContext/globalComponentsContext";
import type { AppProps } from "next/app";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <GlobalComponentsProvider>
    <Defaults />
    <HomePanel />
    <Component {...pageProps} />
  </GlobalComponentsProvider>
);

export default MyApp;
