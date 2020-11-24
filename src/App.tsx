import React from "react";
import "./App.css";
import HoveringMenuExample from "./editors/HoveringMenuExample";
import Puzzle from "./editors/Puzzle";
import RichTextExample from "./editors/Richtext";
import { SyncingEditor } from "./editors/SyncingEditor";

const App = () => {
  return (
    <div className="App">
      <div className="App-header">
        <br />
        <h2>Puzzle</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <Puzzle />
        <br />
        <h2>Local Saved Editor</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <SyncingEditor />
        <br />
        <h2>HoveringMenu Editor</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <HoveringMenuExample />
        <br />
        <h2>Rich Editor</h2>
        <hr style={{ width: "100%", color: "white" }} />
        <RichTextExample />
        <hr style={{ width: "100%", color: "white" }} />
      </div>
    </div>
  );
};

export default App;
