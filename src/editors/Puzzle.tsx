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
      <Toolbar className="toolbar">
        <MakePuzzleButton />
      </Toolbar>
      <Editable
        className="notranslate"
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
const insertPuzz = (editor: any, answer: any, guide: any) => {
  const puzzle = { type: "puzzle", answer, guide, children: [{ text: "" }] };
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
        borderRadius: "4px",
        backgroundColor: "#007AFF",
        fontSize: "0.9em",
        color: "white",
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
    >
      {element.guide}
      {/* {element.answer} */}
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
        answer: ["I am a boy"],
        guide: "나는 소년이다",
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

// const togglePuzzle = ({ editor, target, setTarget }: any) => {
//   const isActive = isPuzzleActive(editor);
//   const { selection } = editor;
//   console.log(selection);

//   if (isActive) {
//     const [start] = Range.edges(selection);
//     const path = start.path;

//     const org = editor.children[path[0]].children[path[1]].answer;

//     Transforms.delete(editor);

//     editor.insertText(org);
//   } else {
//     const originalText = window.getSelection()?.toString();
//     const answer = originalText;
//     if (selection && !Range.isCollapsed(selection)) {
//       const [start, end] = Range.edges(selection);
//       // console.log("start end Range: ", start, end);
//       const orgRange = start && end && Editor.range(editor, start, end);

//       setTarget(orgRange);
//       if (target) {
//         Transforms.select(editor, target);
//       }

//       const guide = window.prompt(`"${originalText}"의 해석`);
//       if (!guide) return;
//       //두번 입력방지와 강제로 커서를 위치시킨다. 현재는 필요가 없지만 나중에 활용
//       //   editor.insertText("");
//       insertPuzz(editor, answer, guide);
//       //   console.log("answer, guide: ", answer, guide);

//       setTarget(null);
//     }
//   }
// };

const MakePuzzle = ({ editor, target, setTarget }: any) => {
  const { selection } = editor;
  console.log(selection);
  const originalText = window.getSelection()?.toString();
  const answer = originalText;
  if (selection && !Range.isCollapsed(selection)) {
    const [start, end] = Range.edges(selection);
    // console.log("start end Range: ", start, end);
    const orgRange = start && end && Editor.range(editor, start, end);

    setTarget(orgRange);
    if (target) {
      Transforms.select(editor, target);
    }

    const guide = window.prompt(`"${originalText}"의 해석`);
    if (!guide) return;
    //두번 입력방지와 강제로 커서를 위치시킨다. 현재는 필요가 없지만 나중에 활용
    //   editor.insertText("");
    insertPuzz(editor, answer, guide);
    //   console.log("answer, guide: ", answer, guide);

    setTarget(null);
  }
};

const MakePuzzleButton = () => {
  const editor = useSlate();
  // 선택된 문자열의 시작과 끝 지점 값
  const [target, setTarget] = useState<Range | null>();

  console.log(isPuzzleActive(editor));
  const isActive = isPuzzleActive(editor);

  // 선택된 에디터를 가져온다.

  // 커서가 문자를 선택한 상태

  return (
    <Button
      active={isPuzzleActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        //퍼즐이 포함 되어있으면 작동 안함
        if (!isActive) {
          MakePuzzle({ editor, target, setTarget });
        }
        // 선택한 문장을 answer변수에 저장한다.
      }}
    >
      <Icon
        icon="format_Puzzle"
        size={20}
        color={isActive ? "gray" : "black"}
      />
    </Button>
  );
};
