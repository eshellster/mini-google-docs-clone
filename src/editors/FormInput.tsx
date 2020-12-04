import React, { useRef } from "react";
import { InputModal, Portal } from "../components/Components";

export const FormInput = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const onClickHandle = () => {
    const el = ref.current;
    //   const domRange = ReactEditor.toDOMRange(editor, target);
    const rect = parentRef.current?.getBoundingClientRect();

    if (el) {
      if (rect) {
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
        el.style.left = `${
          rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
        }px`;
      }
    }
  };

  return (
    <div ref={parentRef}>
      <Portal>
        <InputModal
          ref={ref}
          style={{
            top: "-9999px",
            left: "-9999px",
            position: "absolute",
            zIndex: 1,
            width: "50%",
            padding: "25px",
            backgroundImage: "linear-gradient(to right, #ff512f, #dd2476)",
            borderRadius: "4px",
            boxShadow: "0 1px 5px rgba(0,0,0,.2)",
          }}
        >
          <h1 style={{ color: "white" }}>영어문장 퍼즐생성</h1>
          <div className="input-block">
            <label>원본</label>
            <textarea />
          </div>

          <div className="input-block">
            <label>해석</label>
            <textarea />
          </div>
          <div style={{ display: "flex" }}>
            <button className="square-button" style={{ marginRight: "10px" }}>
              취소
            </button>
            <button className="square-button" style={{ marginLeft: "10px" }}>
              확인
            </button>
          </div>
        </InputModal>
      </Portal>
      <button onClick={onClickHandle}>test</button>
    </div>
  );
};
