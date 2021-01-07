import React, { useEffect, useRef, useState } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, Transforms, Range } from "slate";
import { Button, HoverMenu, Portal } from "./Components";
import Icon from "../Icon";
import { _AndroidDevice, _iOSDevice } from "../utils/IsDevice";
const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const QuickHoveringToolbar = (editable: any, setEditable: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (_iOSDevice || _AndroidDevice) {
      document.addEventListener("touchstart", () => setVisible(false));
      document.addEventListener("touchend", () => setVisible(true));
    } else {
      document.addEventListener("selectionchange", () => setVisible(false));
      document.addEventListener("mouseup", () => setVisible(true));
    }

    if (
      !visible ||
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();

    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();
    // console.log("셀렉션:", rect);
    // console.log("element길이:", el.offsetWidth);

    if (rect) {
      const rectCenter = rect.left + rect.width / 2;
      // 메뉴가 화면보다 클때
      if (el.offsetWidth > window.innerWidth) {
        el.style.left = "0px";
        // 메뉴 시작 위치 화면 밖으로 나가면
      } else if (rectCenter < el.offsetWidth / 2) {
        el.style.left = "20px";
        // 메뉴 끝의 위치 화면 밖으로 나가면
      } else if (rectCenter + el.offsetWidth / 2 > window.innerWidth) {
        el.style.left = `${window.innerWidth - el.offsetWidth - 20}px`;
        // 선택 문자의 중앙
      } else {
        el.style.left = `${
          rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
        }px`;
      }

      if (_iOSDevice || _AndroidDevice) {
        el.style.opacity = "1";
        el.style.top = `${rect.bottom + window.pageYOffset + 28}px`;
      } else {
        el.style.opacity = "1";
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
      }
    }
  });

  return (
    <Portal>
      <HoverMenu ref={ref}>
        {editable ? (
          <nav>
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format="code" icon="code" />

            <QuestionInlineBlockButton
              format="answer_test-question"
              icon="format_answer_test_question"
            />
            <QuestionInlineBlockButton
              format="word_ordering-question"
              icon="format_word_ordering_question"
            />
            <QuestionBlockButton
              format="choice-question"
              icon="format_multiple_choice_question"
            />
            <QuestionBlockButton
              format="ordering-question"
              icon="format_ordering_question"
            />
            <QuestionBlockButton
              format="match_pairs-question"
              icon="format_match_pairs_question"
            />
            <QuestionBlockButton
              format="written_test-question"
              icon="format_written_question"
            />

            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="block-quote" icon="format_quote" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
          </nav>
        ) : null}
      </HoverMenu>
    </Portal>
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

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: any) => {
  if (format.match("-question")) {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        n.type === "word_ordering-question" ||
        n.type === "answer_test-question" ||
        n.type === "choice-question" ||
        n.type === "ordering-question" ||
        n.type === "match_pairs-question" ||
        n.type === "written_test-question",
    });
    return !!match;
  } else {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === format,
    });
    return !!match;
  }
};

export const isMarkActive = (editor: Editor, format: any) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
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
      <Icon icon={icon} size={20} color="black" />
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
      <Icon icon={icon} size={20} color="black" />
    </Button>
  );
};

const insertQuest = (editor: any, answer: any, guide: any, format: any) => {
  const quest = { type: format, answer, guide, children: [{ text: "" }] };
  Transforms.insertNodes(editor, quest);
};

const MakeQuest = ({ editor, target, setTarget, format }: any) => {
  const { selection } = editor;
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
    if (format === "word_ordering-question") {
      guide = window.prompt(`"${originalText}"의 해석`);
      if (!guide) return;
    }

    if (format === "choice-question") {
      guide = window.prompt(`"${originalText}"유사한 보기를 작성해주세요`);
      if (!guide) return;
    }
    insertQuest(editor, answer, guide, format);

    //두번 입력방지와 강제로 커서를 위치시킨다. 현재는 필요가 없지만 나중에 활용
    //   editor.insertText("");

    //   console.log("answer, guide: ", answer, guide);

    setTarget(null);
  }
};

const QuestionInlineBlockButton = ({ format, icon }: any) => {
  const editor = useSlate();
  // 선택된 문자열의 시작과 끝 지점 값
  const [target, setTarget] = useState<Range | null>();

  const isActive = isBlockActive(editor, format);

  // 선택된 에디터를 가져온다.
  if (isActive) return null;
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

const QuestionBlockButton = ({ format, icon }: any) => {
  const editor = useSlate();
  // 선택된 문자열의 시작과 끝 지점 값
  const [target, setTarget] = useState<Range | null>();

  const isActive = isBlockActive(editor, format);

  if (isActive) return null;
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
