import React from "react";
import { useFocused, useSelected } from "slate-react";
import { _AndroidDevice, _iOSDevice } from "../utils/IsDevice";

export const Element = (props: any) => {
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
    case "word_ordering-question":
      return <PuzzleElement {...props} />;
    case "answer_test-question":
      return <QuestionElement {...props} />;
    case "choice-question":
      return <QuestionMCElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export const PuzzleElement = ({
  attributes,
  children,
  element,
  setEditable,
}: any) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      contentEditable={false}
      onMouseDown={(event: any) => {
        event.preventDefault();
        if (_iOSDevice || _AndroidDevice) setEditable(false);
      }}
      onMouseUp={(event: any) => {
        event.preventDefault();
        if (_iOSDevice || _AndroidDevice) setEditable(true);
      }}
      style={{
        padding: "3px 3px 2px",
        margin: "0 1px",
        verticalAlign: "baseline",
        borderRadius: "4px",
        backgroundColor: "#007AFF",
        fontSize: "0.9em",
        fontWeight: "600",
        color: "white",
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
        cursor: "pointer",
      }}
    >
      {element.guide}
      {/* {element.answer} */}
      {children}
    </span>
  );
};

export const QuestionElement = ({ attributes, children, element }: any) => {
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
        cursor: "pointer",
      }}
    >
      {emptyText}
      {children}
    </span>
  );
};

export const QuestionMCElement = ({ attributes, children, element }: any) => {
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
        border: "dotted 4px #007AFF",
        display: "inline-block",
        fontSize: "0.6em",
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
        cursor: "pointer",
      }}
    >
      {emptyText}
      {children}
    </span>
  );
};

export const Leaf = ({ attributes, children, leaf }: any) => {
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
