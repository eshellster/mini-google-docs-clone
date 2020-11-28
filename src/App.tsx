import React from "react";
import "./App.css";
// import MentionExample from "./editors/mentions";
// import HoveringMenuExample from "./editors/HoveringMenuExample";
// import LinkExample from "./editors/Links";
// import Puzzle from "./editors/Puzzle";
import RichText from "./editors/RichtextWithPuzzle";
// import RichTextExample from "./editors/Richtext";
// import { SyncingEditor } from "./editors/SyncingEditor";

const App = () => {
  return (
    <div className="App">
      <div className="App-header">
        {/* <br />
        <h2>Mention</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <MentionExample />
        <br /> */}
        {/* <h2>Links</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <LinkExample />
        <br /> */}
        {/* <h2>Puzzle</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <Puzzle />
        <br /> */}
        {/* <h2>Local Saved Editor</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <SyncingEditor />
        <br /> */}
        {/* <h2>HoveringMenu Editor</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <HoveringMenuExample />
        <br /> */}
        <h2>Rich Editor</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <RichText />
        <hr style={{ width: "100%", color: "white" }} />
      </div>
    </div>
  );
};

export default App;
