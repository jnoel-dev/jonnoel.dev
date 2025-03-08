
import "../global.css";
import HomePanel from "../components/pagePanels/HomePanel";
import { GlobalComponentsProvider } from "../components/globalComponentsContext/GlobalComponentsContext";
import Background from "../components/background/Background";
import UnderConstructionPanel from "../components/pagePanels/UnderContructionPanel";

// import UnderContructionPanel from "../components/homePanel/underContructionPanel";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html>
          <head>
      <title>★welcome</title>
      <link
        rel="shortcut icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌙</text></svg>"
      />
          <script>
      {`
        function titleMarquee() {
          document.title = document.title.substring(1) + document.title.substring(0, 1);
          setTimeout(titleMarquee, 200);
        }
        titleMarquee();
      `}
    </script>
    </head>
      <body>
      <Background/>
    <GlobalComponentsProvider>
          {/* <HomePanel panelId="home"/> */}
          <UnderConstructionPanel panelId="home"/>
    {children}



  </GlobalComponentsProvider>
  </body>
  </html>
  );
  
}