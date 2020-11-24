import React, { useState, useMemo, useRef, useEffect } from "react";
import { Slate, Editable, ReactEditor, withReact, useSlate } from "slate-react";
import { Editor, Transforms, Text, createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { Button, HoverMenu, Portal } from "../components/Components";
import { Range } from "slate";
import Icon from "../Icon";

const HoveringMenuExample = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Node[]>(initialValue);

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <HoveringToolbar />
      <Editable
        renderLeaf={(props) => <Leaf {...props} />}
        placeholder="Enter some text..."
        onDOMBeforeInput={(event: any) => {
          // event.preventDefault();
          switch (event.inputType) {
            case "formatBold":
              return toggleFormat(editor, "bold");
            case "formatItalic":
              return toggleFormat(editor, "italic");
            case "formatUnderline":
              return toggleFormat(editor, "underline");
            case "formatStrikethrough":
              return toggleFormat(editor, "strikethrough");
          }
        }}
      />
    </Slate>
  );
};

const toggleFormat = (editor: any, format: any) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor: any, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: "all",
  });
  return !!match;
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <del style={{ color: "gray" }}>{children}</del>;
  }
  if (leaf.puzzle) {
    children = (
      <span>
        <Icon icon="puzz_play" size={20} color="lightblue" />
        <span>[한글로 번역된 내용이 들어간다.]</span>
        {children}
      </span>
    );
  }
  return <span {...attributes}>{children}</span>;
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
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
    if (rect) {
      el.style.opacity = "1";
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
      el.style.left = `${
        rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
      }px`;
    }
  });

  return (
    <Portal>
      <HoverMenu ref={ref}>
        <FormatButton format="bold" icon="format_Bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_Underlined" />
        <FormatButton format="strikethrough" icon="format_Strikethrough" />
        <FormatButton format="puzzle" icon="format_Puzzle" />
      </HoverMenu>
    </Portal>
  );
};

const FormatButton = ({ format, icon }: any) => {
  const editor = useSlate();
  return (
    <Button
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleFormat(editor, format);
      }}
    >
      <Icon
        icon={
          isFormatActive(editor, format) && format === "puzzle" ? null : icon
        }
        size={20}
        color={isFormatActive(editor, format) ? "#aaa" : "white"}
      />
    </Button>
  );
};

const initialValue = [
  {
    children: [
      {
        text:
          "This example shows how you can make a hovering menu appear above your content, which you can use to make text ",
      },
      { text: "bold", bold: true },
      { text: ", " },
      { text: "italic", italic: true },
      { text: ", or anything else you might want to do!" },
    ],
  },
  {
    children: [
      { text: "Try it out yourself! Just " },
      { text: "select any piece of text and the menu will appear", bold: true },
      { text: "." },
    ],
  },
];

export default HoveringMenuExample;
