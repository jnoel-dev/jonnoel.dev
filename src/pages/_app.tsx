import Defaults from "../components/defaults";
import "../global.css";
import HomePanel from "../components/homePanel/homePanel";
import { GlobalComponentsProvider } from "../components/globalComponentsContext/globalComponentsContext";
import type { AppProps } from "next/app";
import UnderContructionPanel from "../components/homePanel/underContructionPanel";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <GlobalComponentsProvider>
    <Defaults />
    <HomePanel />
    <UnderContructionPanel />
    <Component {...pageProps} />
  </GlobalComponentsProvider>
);

export default MyApp;
