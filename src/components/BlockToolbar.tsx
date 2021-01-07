import React, { useRef } from "react";
import { useSlate } from "slate-react";
import { Range } from "slate";

export const EditorToolbar = (editable: any, setEditable: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const { selection } = editor;
  console.log(IsCollapsed(editor));
  console.log(selection);

  //   const domRange = domSelection?.getRangeAt(0);
  //   const rect = domRange?.getBoundingClientRect();
  //   console.log("셀렉션:", rect);
  // console.log("element길이:", el.offsetWidth);

  return <div>호버</div>;
};

const IsCollapsed = (editor: any) => {
  // if editor is falsy or has no selection, return null
  if (!editor) return null;

  // if editor has no selection, return null
  if (!editor.selection) return null;

  // return collapsed state
  return Range.isCollapsed(editor.selection);
};
