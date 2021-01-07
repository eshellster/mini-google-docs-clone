import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate } from "slate-react";
import { createEditor, Node } from "slate";
import { withHistory } from "slate-history";

import { Toolbar } from "../components/Components";

import { Element, Leaf } from "../components/EditorElements";
import {
  QuickHoveringToolbar,
  toggleMark,
} from "../components/QuickHoveringToolbar";
import { EditorToolbar } from "../components/BlockToolbar";

const HOTKEYS: any = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const RichText = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const [editable, setEditable] = useState(true);
  const renderElement = useCallback(
    (props) => <Element {...props} setEditable={setEditable} />,
    []
  );
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withQuest(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <QuickHoveringToolbar editor={editor} setEditable={setEditable} />
      <EditorToolbar />
      <Toolbar className="toolbar"></Toolbar>
      <Editable
        readOnly={!editable}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey as string, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const withQuest = (editor: any) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === "word_ordering-question" ||
      element.type === "answer_test-question"
      ? true
      : isInline(element);
  };
  editor.isVoid = (element: any) => {
    return element.type === "word_ordering-question" ||
      element.type === "answer_test-question"
      ? true
      : isVoid(element);
  };

  return editor;
};

const initialValue = [
  {
    type: "heading-one",
    children: [
      { text: "Unit 02", code: true },
      { text: " A Nation of Immigrants" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "The United States is a nation ",
      },
      {
        type: "choice-question",
        answer: ["of", "for", "to", "in"],
        guide: "",
        children: [{ text: "" }],
      },
      {
        text:
          " immigrants. People immigrate to the U.S. from all over the world.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          'In the early 1900s, many immigrants came from Europe. They sailed on ships across the Atlantic Ocean. They often arrived at Ellis Island in New York Harbor. In New York Harbor, the Statue of Liberty greeted them. For many immigrants, “Lady Liberty" was the first thing they saw in America. It was a symbol of freedom to these immigrants.',
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "In the 1960s, many immigrants came from Asia. They often arrived at Angel Island in San Francisco Bay.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Moving to another country is not always easy. Immigrants have to get used to their new homes. They often have to start a completely new way of life. ",
      },
      {
        type: "word_ordering-question",
        answer: [
          "They have to learn about a new culture and find new jobs and homes.",
        ],
        guide: "그들은 새로운 문명을 배우려 했고 새로운 직업과 집을 찾는다.",
        children: [{ text: "" }],
      },
      {
        text: " They need to learn a new language as well.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Some immigrants live with the same ethnic group. Ethnic neighbors can help them get used to their new country.",
      },
    ],
  },
];

export default RichText;
