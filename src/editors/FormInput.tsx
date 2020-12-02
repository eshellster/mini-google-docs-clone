import React, { useRef } from "react";
import { Portal } from "../components/Components";

export const FormInput = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const onClickHandle = () => {
    const el = ref.current;
    //   const domRange = ReactEditor.toDOMRange(editor, target);
    const rect = parentRef.current?.getBoundingClientRect();
    console.log(rect);

    if (el) {
      if (rect) {
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
        el.style.left = `${
          rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
        }px`;
      }
    }
    console.log(rect);
  };

  return (
    <div ref={parentRef}>
      <Portal>
        <div
          ref={ref}
          style={{
            top: "-9999px",
            left: "-9999px",
            position: "absolute",
            zIndex: 1,
            padding: "3px",
            background: "white",
            borderRadius: "4px",
            boxShadow: "0 1px 5px rgba(0,0,0,.2)",
          }}
        >
          <div>
            <label>원본</label>
            <textarea />
          </div>

          <div>
            <label>해석</label>
            <textarea />
          </div>
          <button>취소</button>
          <button>확인</button>
        </div>
      </Portal>
      <button onClick={onClickHandle}>test</button>
    </div>
  );
};
