import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Node, Transforms } from "slate";
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

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

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
        renderElement={renderElement}
        onKeyDown={(event) => {
          if (event.key === "`" && event.ctrlKey) {
            // "`" 만 삽입되는 것을 방지합니다.
            event.preventDefault();
            // 현재 유형을 "code"로 설정합니다.
            Transforms.setNodes(
              editor,
              { type: "code" },
              { match: (n) => Editor.isBlock(editor, n) }
            );
          }
        }}
      />
    </Slate>
  );
};

const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};
