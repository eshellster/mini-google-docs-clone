import React from "react";
import "./App.css";
import HoveringMenuExample from "./HoveringMenuExample";
import { SyncingEditor } from "./SyncingEditor";

const App = () => {
  return (
    <div>
      <SyncingEditor />
      <HoveringMenuExample />
    </div>
  );
};

export default App;
