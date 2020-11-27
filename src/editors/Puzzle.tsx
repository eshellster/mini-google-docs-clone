import React, { useState, useMemo, useEffect } from "react";
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
    // console.log("value:", value);
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
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === "puzzle" ? true : isInline(element);
  };
  editor.isVoid = (element: any) => {
    return element.type === "puzzle" ? true : isVoid(element);
  };

  return editor;
};

// 퍼즐 추가
const insertPuzz = (editor: any, eng: any, kor: any) => {
  const puzzle = { type: "puzzle", eng, kor, children: [{ text: "" }] };
  Transforms.insertNodes(editor, puzzle);
};

// puzzle 선택 여부
const isPuzzleActive = (editor: any) => {
  const [puzzle] = Editor.nodes(editor, { match: (n) => n.type === "puzzle" });
  return !!puzzle;
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
      {element.kor}
      {/* {element.eng} */}
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
        children: [{ text: "" }],
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

const togglePuzzle = ({ editor, target, setTarget }: any) => {
  const isActive = isPuzzleActive(editor);
  const { selection } = editor;

  if (isActive) {
    const [start] = Range.edges(selection);
    const path = start.path;

    const org = editor.children[path[0]].children[path[1]].eng;

    Transforms.delete(editor);

    editor.insertText(org);
  } else {
    const eng = window.getSelection()?.toString();
    if (selection && !Range.isCollapsed(selection)) {
      const [start, end] = Range.edges(selection);
      // console.log("start end Range: ", start, end);
      const orgRange = start && end && Editor.range(editor, start, end);

      setTarget(orgRange);
      if (target) {
        Transforms.select(editor, target);
      }

      const kor = window.prompt(`"${eng}"의 해석`);
      if (!kor) return;
      //두번 입력방지와 강제로 커서를 위치시킨다. 현재는 필요가 없지만 나중에 활용
      //   editor.insertText("");
      insertPuzz(editor, eng, kor);
      //   console.log("eng, kor: ", eng, kor);

      setTarget(null);
    }
  }
};

const MakePuzzleButton = () => {
  const editor = useSlate();
  // 선택된 문자열의 시작과 끝 지점 값
  const [target, setTarget] = useState<Range | null>();

  // 선택된 에디터를 가져온다.

  // 커서가 문자를 선택한 상태

  return (
    <Button
      active={isPuzzleActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault();

        togglePuzzle({ editor, target, setTarget });
        // 선택한 문장을 eng변수에 저장한다.
      }}
    >
      <Icon icon="format_Puzzle" size={20} />
    </Button>
  );
};
