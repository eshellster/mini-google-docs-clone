import React, { useState, useMemo } from "react";
import isUrl from "is-url";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { Node, Transforms, Editor, Range, createEditor } from "slate";
import { withHistory } from "slate-history";

import { Button, Toolbar } from "../components/Components";
import Icon from "../Icon";

const Puzzle = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const editor = useMemo(
    () => withPuzzles(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Toolbar>
        <MakePuzzleButton />
      </Toolbar>
      <Editable
        renderElement={(props) => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  );
};

const withPuzzles = (editor: any) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: any) => {
    return element.type === "puzzle" ? true : isInline(element);
  };

  editor.insertText = (text: any) => {
    if (text && isUrl(text)) {
      wrapPuzzle(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data: any) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapPuzzle(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertPuzz = (editor: any, eng: any, kor: any) => {
  if (editor) {
    wrapPuzzle(editor, eng);
  }
};

const isLinkActive = (editor: any) => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === "link" });
  return !!link;
};

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case "puzzle":
      return (
        <span
          {...attributes}
          eng={element.eng}
          style={{
            padding: "3px 3px 2px",
            margin: "0 1px",
            verticalAlign: "baseline",
            display: "inline-block",
            borderRadius: "4px",
            backgroundColor: "#eee",
            fontSize: "0.9em",
            boxShadow: "0 0 0 2px #B4D5FF",
          }}
        >
          {children}
        </span>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const initialValue = [
  {
    children: [
      {
        text: "In addition to block nodes, you can create inline nodes, like ",
      },
      {
        type: "puzzle",
        eng: "I am a boy",
        kor: "나는 소년이다",
        children: [{ text: "나는 소년이다" }],
      },
      {
        text: "!",
      },
    ],
  },
  {
    children: [
      {
        text:
          "This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.",
      },
    ],
  },
];

export default Puzzle;

const MakePuzzleButton = () => {
  const editor = useSlate();
  // 선택한 문자열 가져오기
  //   const selectedText = window.getSelection();

  const { selection } = editor;
  //   console.log("before - selection:", selection);
  //   console.log("eng:", eng);

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        const eng = window.getSelection()?.toString();
        if (selection && !Range.isCollapsed(selection)) {
          editor.deleteFragment();
        }

        // console.log("after - selection:", selection);

        const kor = window.prompt(`"${eng}"의 해석`);
        if (!kor) return;
        const length = kor.length;
        // console.log("length", length);
        // console.log("selection?.anchor: ", selection?.anchor);

        editor.insertText(kor);

        const anchorOffset = selection?.anchor.offset;
        let focusOffset: number = 0;
        if (anchorOffset) {
          focusOffset = anchorOffset + length;
        }

        let focusPath: number[] = [];
        if (
          selection?.anchor.path[0] !== undefined &&
          selection?.anchor.path[1] !== undefined
        )
          focusPath = [selection?.anchor.path[0], selection?.anchor.path[1]];

        // console.log("focusPath:", focusPath);

        Transforms.setSelection(editor, {
          anchor: selection?.anchor,
          focus: { path: focusPath, offset: focusOffset },
        });

        insertPuzz(editor, eng, kor);
      }}
    >
      <Icon icon="format_Puzzle" size={20} />
    </Button>
  );
};

const unwrapPuzzle = (editor: any) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === "puzzle" });
};

const wrapPuzzle = (editor: any, eng: any) => {
  if (isLinkActive(editor)) {
    unwrapPuzzle(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const puzzle = {
    type: "puzzle",
    eng,
    kor: "",
    children: isCollapsed ? [{ text: eng }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, puzzle);
  } else {
    Transforms.wrapNodes(editor, puzzle, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
