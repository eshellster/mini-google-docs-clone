import React from "react";
import "./App.css";
import HoveringMenuExample from "./editors/HoveringMenuExample";
import { SyncingEditor } from "./editors/SyncingEditor";

const App = () => {
  return (
    <div className="App-header">
      <SyncingEditor />
      <HoveringMenuExample />
    </div>
  );
};

export default App;
