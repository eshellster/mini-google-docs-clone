import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export const SyncingEditor = () => {
  // 랜더링간에 변경되지 않는 Slate 편집기 개체를 만듭니다.
  const editor = useMemo(() => withReact(createEditor()), []);
  // 편집기의 값에 대한 상태를 추적합니다.
  // 상태를 설정할 때 초기 값을 추가합니다.
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  //슬레이트 컨텍스트를 랜더링합니다.
  return (
    //컨텍스트 내에 편집 가능한 구성 요소를 추가합니다.
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    >
      <Editable
        onKeyDown={(event) => {
          console.log(event.key);
        }}
      />
    </Slate>
  );
};
