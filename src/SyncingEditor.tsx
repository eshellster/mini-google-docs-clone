import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export const SyncingEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value); // Save the value to Local Storage.
        const content = JSON.stringify(value);
        localStorage.setItem("content", content);
      }}
    >
      <Editable />
    </Slate>
  );
};
