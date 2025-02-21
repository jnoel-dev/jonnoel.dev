import Defaults from "../components/defaults";
import Panel from "../components/panel/panel";

function HomePage() {
  return (
    <>
      <Defaults>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            paddingTop: "25%",
            pointerEvents: "none",
          }}
        ></div>
      </Defaults>
    </>
  );
}

export default HomePage;
