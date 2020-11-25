import React, { useState, useMemo, useCallback, useEffect } from "react";
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

  useEffect(() => {
    console.log("value:", value);
  }, [value]);

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
    wrapPuzzle(editor, eng, kor);
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
  const [target, setTarget] = useState<Range | null>();
  const [korTarget, setKorTarget] = useState<Range | null>();

  const { selection } = editor;
  console.log("selection", selection?.anchor, selection?.focus);
  //   console.log("eng:", eng);

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        const eng = window.getSelection()?.toString();
        if (selection && !Range.isCollapsed(selection)) {
          const [start, end] = Range.edges(selection);
          console.log("start end Range: ", start, end);

          const orgRange = start && end && Editor.range(editor, start, end);

          setTarget(orgRange);
          if (target) {
            Transforms.select(editor, target);
          }

          const kor = window.prompt(`"${eng}"의 해석`);
          if (!kor) return;
          //   const length = kor.length;
          editor.insertText(kor);
          insertPuzz(editor, eng, kor);
          console.log("eng, kor: ", eng, kor);

          setTarget(null);
        }

        // window.getSelection()?.deleteFromDocument();

        // console.log("after - selection:", selection);

        // console.log("length", length);

        // editor.insertText(kor);

        // const anchorOffset = selection?.anchor.offset;
        // let focusOffset: number = 0;
        // if (anchorOffset) {
        //   focusOffset = anchorOffset + length;
        // }

        // let focusPath: number[] = [];
        // if (selection?.anchor.path[0] !== undefined) {
        //   focusPath = selection?.anchor.path;
        // }
        // console.log(
        //   "anchor: ",
        //   selection?.anchor,
        //   "focus: { path: ",
        //   focusPath,
        //   "offset: ",
        //   focusOffset
        // );

        // Transforms.setSelection(editor, {
        //   anchor: selection?.anchor,
        //   focus: { path: focusPath, offset: focusOffset },
        // });
      }}
    >
      <Icon icon="format_Puzzle" size={20} />
    </Button>
  );
};

const unwrapPuzzle = (editor: any) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === "puzzle" });
};

const wrapPuzzle = (editor: any, eng: any, kor?: any) => {
  if (isLinkActive(editor)) {
    unwrapPuzzle(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const puzzle = {
    type: "puzzle",
    eng,
    kor,
    children: isCollapsed ? [{ text: kor }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, puzzle);
  } else {
    Transforms.wrapNodes(editor, puzzle, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
