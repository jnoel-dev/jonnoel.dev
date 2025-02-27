import React from "react";
import Script from "next/script";
import Head from "next/head";
import Background from "./background/background";

const Defaults: React.FC = () => (
  <>
    <Head>
      <title>★welcome</title>
      <link
        rel="shortcut icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌙</text></svg>"
      />
    </Head>
    <Script>
      {`
        function titleMarquee() {
          document.title = document.title.substring(1) + document.title.substring(0, 1);
          setTimeout(titleMarquee, 200);
        }
        titleMarquee();
      `}
    </Script>
    <Background/>
  </>
);

export default Defaults;
