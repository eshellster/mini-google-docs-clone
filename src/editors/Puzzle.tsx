import React, { useState, useMemo, useEffect } from "react";
import isUrl from "is-url";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  useSelected,
  useFocused,
} from "slate-react";
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

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "puzzle":
      return <PuzzleElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const PuzzleElement = ({ attributes, children, element }: any) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        padding: "3px 3px 2px",
        margin: "0 1px",
        verticalAlign: "baseline",
        display: "inline-block",
        borderRadius: "4px",
        backgroundColor: "#eee",
        fontSize: "0.9em",
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
    >
      {children}
    </span>
  );
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
  // 선택된 문자열의 시작과 끝 지점 값
  const [target, setTarget] = useState<Range | null>();

  // 선택된 에디터를 가져온다.
  const { selection } = editor;
  //   console.log("selection", selection?.anchor, selection?.focus);
  //   console.log("eng:", eng);

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        // 선택한 문장을 eng변수에 저장한다.
        const eng = window.getSelection()?.toString();
        // 커서가 문자를 선택한 상태
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
          //두번 입력방지와 강제로 커서를 위치시킨다.
          editor.insertText("");
          insertPuzz(editor, eng, kor);
          console.log("eng, kor: ", eng, kor);

          setTarget(null);
        }
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
