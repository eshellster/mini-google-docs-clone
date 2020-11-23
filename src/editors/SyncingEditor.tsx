import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

// 값을 받아 문자열을 반환하는 직렬화 함수를 정의합니다.
const serialize = (value: any) => {
  return (
    value
      // 자식에 있는 값에서 각 단락의 문자열 내용을 반환합니다.
      .map((n: any) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join("\n")
  );
};

// 문자열을 반아서 값을 반환하는 역 직렬화 함수를 정의합니다.
const deserialize = (string: any) => {
  // 문자열을 분활하여 파생된 자식의 값을 배열로 반환합니다.
  return string.split("\n").map((line: any) => {
    return {
      children: [{ text: line }],
    };
  });
};

export const SyncingEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  //역 직렬화 기능을 사용하여 로컬 저장소에서 데이터를 읽습니다.
  const [value, setValue] = useState<Node[]>(
    deserialize(localStorage.getItem("content")) || ""
  );

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value); // 값을 직렬화하고 문자열 값을 로컬 저장소에 저장합니다.
        localStorage.setItem("content", serialize(value));
      }}
    >
      <Editable />
    </Slate>
  );
};
