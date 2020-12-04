import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  useSelected,
  useFocused,
} from "slate-react";
import { Editor, Transforms, createEditor, Node, Range } from "slate";
import { withHistory } from "slate-history";

import { Button, Toolbar } from "../components/Components";
import Icon from "../Icon";

const HOTKEYS: any = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const RichText = () => {
  const [value, setValue] = useState<Node[]>(initialValue);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withQuest(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Toolbar>
        <MarkButton format="bold" icon="format_Bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_Underlined" />
        <MarkButton format="code" icon="code" />
        <InlineBlockButton format="puzzle" icon="mix" />
        <InlineBlockButton format="question" icon="format_question" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Toolbar>
      <Editable
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

const toggleBlock = (editor: Editor, format: any) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor: Editor, format: any) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "puzzle":
      return <PuzzleElement {...props} />;
    case "question":
      return <QuestionElement {...props} />;
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

const QuestionElement = ({ attributes, children, element }: any) => {
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
        margin: "0 1px",
        verticalAlign: "baseline",
        border: "solid 4px #007AFF",
        display: "inline-block",
        fontSize: "0.6em",
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
    >
      {emptyText}
      {children}
    </span>
  );
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon icon={icon} size={20} />
    </Button>
  );
};

const MarkButton = ({ format, icon }: any) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon icon={icon} size={20} />
    </Button>
  );
};

const MakeQuest = ({ editor, target, setTarget, format }: any) => {
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

    let guide = null;
    if (format === "puzzle") {
      guide = window.prompt(`"${originalText}"의 해석`);
      if (!guide) return;
    }

    insertQuest(editor, answer, guide, format);

    //두번 입력방지와 강제로 커서를 위치시킨다. 현재는 필요가 없지만 나중에 활용
    //   editor.insertText("");

    //   console.log("answer, guide: ", answer, guide);

    setTarget(null);
  }
};

const InlineBlockButton = ({ format, icon }: any) => {
  const editor = useSlate();
  // 선택된 문자열의 시작과 끝 지점 값
  const [target, setTarget] = useState<Range | null>();

  const isActive = isBlockActive(editor, format);

  // 선택된 에디터를 가져온다.

  // 커서가 문자를 선택한 상태

  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        //퍼즐이 포함 되어있으면 작동 안함
        if (!isActive) {
          MakeQuest({ editor, target, setTarget, format });
        }
        // 선택한 문장을 answer변수에 저장한다.
      }}
    >
      <Icon icon={icon} size={20} color={isActive ? "gray" : "black"} />
    </Button>
  );
};

// const MakeQuestionButton = (format) => {
//   const editor = useSlate();
//   // 선택된 문자열의 시작과 끝 지점 값
//   const [target, setTarget] = useState<Range | null>();

//   const isActive = isQuestActive(editor);

//   // 선택된 에디터를 가져온다.

//   // 커서가 문자를 선택한 상태

//   return (
//     <Button
//       active={isBlockActive(editor,format)}
//       onMouseDown={(event: any) => {
//         event.preventDefault();
//         //퍼즐이 포함 되어있으면 작동 안함
//         if (!isActive) {
//           MakePuzzle({ editor, target, setTarget });
//         }
//         // 선택한 문장을 answer변수에 저장한다.
//       }}
//     >
//       <Icon
//         icon="format_Puzzle"
//         size={20}
//         color={isActive ? "gray" : "black"}
//       />
//     </Button>
//   );
// };

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

const insertQuest = (editor: any, answer: any, guide: any, format: any) => {
  const quest = { type: format, answer, guide, children: [{ text: "" }] };
  Transforms.insertNodes(editor, quest);
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
        text:
          "The United States is a nation of immigrants. People immigrate to the U.S. from all over the world.",
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
          "Moving to another country is not always easy. Immigrants have to get used to their new homes. They often have to start a completely new way of life. They have to learn about a new culture and find new jobs and homes. They need to learn a new language as well.",
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
