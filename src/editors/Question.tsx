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

const Question = () => {
  const [value, setValue] = useState<Node[]>(initialValue);

  const editor = useMemo(
    () => withQuest(withHistory(withReact(createEditor()))),
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
        className="notranslate"
        renderElement={(props) => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  );
};

const withQuest = (editor: any) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === "puzzle" || element.type === "question"
      ? true
      : isInline(element);
  };
  editor.isVoid = (element: any) => {
    return element.type === "puzzle" || element.type === "question"
      ? true
      : isVoid(element);
  };

  return editor;
};

// 퍼즐 추가
const insertPuzz = (editor: any, answer: any[], guide: any) => {
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
  const emptyText = " ";
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        textAlign: "center",
        minWidth: "80px",
        padding: "3px 3px 2px",
        margin: "0 1px",
        verticalAlign: "baseline",
        border: "solid 4px #007AFF",
        display: "inline-block",
        fontSize: "0.9em",
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
    >
      {emptyText}
      {/* {element.guide} */}
      {/* {element.answer} */}
      {children}
    </span>
  );
};

const initialValue = [
  {
    children: [
      {
        text: "신라의 노래를 불러요",
      },
    ],
  },
  {
    children: [
      {
        text: "우리글이 없어서 한자의 음과 뜻을 빌려서 노랫말을 지었지요.",
      },
    ],
  },
  {
    children: [
      {
        text: "노랫말은 주로 자신의 소원이나 귀신을 쫓는 내용이 많았어요.",
      },
    ],
  },
  {
    children: [
      {
        text:
          "널리 알려진 향가 중에 <서동요>라는 노래가 있어요. 백제에 사는 서동이 신라에 사는 선화 공주의 사랑을 얻기 위해 ",
      },
      {
        type: "puzzle",
        answer: ["서동요", "가요"],
        guide: [],
        children: [{ text: "" }],
      },
      {
        text: "라는 노래를 지어 아이들에게 부르게 했대요. 함께 들어 볼까요?",
      },
    ],
  },
  {
    children: [
      {
        text:
          "[네이버 지식백과] 이제 어엿한 나라가 되었어요 (그림으로 보는 한국사, 2012.11.30., 황은희, 이명애, 역사와 사회과를 연구하는 초등 교사 모임(역사초모))",
      },
    ],
  },
];

export default Question;

const togglePuzzle = ({ editor, target, setTarget }: any) => {
  const isActive = isPuzzleActive(editor);
  const { selection } = editor;

  if (isActive) {
    const [start] = Range.edges(selection);
    const path = start.path;

    const org = editor.children[path[0]].children[path[1]].answer[0];

    Transforms.delete(editor);

    editor.insertText(org);
  } else {
    const originalText = window.getSelection()?.toString();
    const answer = [originalText];
    if (selection && !Range.isCollapsed(selection)) {
      const [start, end] = Range.edges(selection);
      // console.log("start end Range: ", start, end);
      const orgRange = start && end && Editor.range(editor, start, end);

      setTarget(orgRange);
      if (target) {
        Transforms.select(editor, target);
      }

      const guide = [window.prompt(`"${originalText}"의 해석`)];
      if (!guide) return;
      //두번 입력방지와 강제로 커서를 위치시킨다. 현재는 필요가 없지만 나중에 활용
      //   editor.insertText("");
      insertPuzz(editor, answer, " ");
      //   console.log("answer, guide: ", answer, guide);

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
        // 선택한 문장을 answer변수에 저장한다.
      }}
    >
      <Icon icon="format_Puzzle" size={20} />
    </Button>
  );
};
