import React, { Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
// import { act } from "react-dom/test-utils";
import "./Components.css";

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>
  ) => <span {...props} ref={ref} className="button" />
);

// export const EditorValue = React.forwardRef(
//   (
//     {
//       className,
//       value,
//       ...props
//     }: PropsWithChildren<
//       {
//         value: any;
//       } & BaseProps
//     >,
//     ref: Ref<HTMLDivElement>
//   ) => {
//     const textLines = value.document.nodes
//       .map((node: any) => node.text)
//       .toArray()
//       .join("\n");
//     return (
//       <div
//         ref={ref}
//         {...props}
//         className={cx(
//           className,
//           css`
//             margin: 30px -20px 0;
//           `
//         )}
//       >
//         <div
//           className={css`
//             font-size: 14px;
//             padding: 5px 20px;
//             color: #404040;
//             border-top: 2px solid #eeeeee;
//             background: #f8f8f8;
//           `}
//         >
//           Slate's value as text
//         </div>
//         <div
//           className={css`
//             color: #404040;
//             font: 12px monospace;
//             white-space: pre-wrap;
//             padding: 10px 20px;
//             div {
//               margin: 0 0 0.5em;
//             }
//           `}
//         >
//           {textLines}
//         </div>
//       </div>
//     );
//   }
// );

// export const Icon = React.forwardRef(
//   (
//     { className, ...props }: PropsWithChildren<BaseProps>,
//     ref: Ref<HTMLSpanElement>
//   ) => <span {...props} ref={ref} className="material-icons" />
// );

// export const Instruction = React.forwardRef(
//   (
//     { className, ...props }: PropsWithChildren<BaseProps>,
//     ref: Ref<HTMLDivElement>
//   ) => (
//     <div
//       {...props}
//       ref={ref}
//       className={cx(
//         className,
//         css`
//           white-space: pre-wrap;
//           margin: 0 -20px 10px;
//           padding: 10px 20px;
//           font-size: 14px;
//           background: #f8f8e8;
//         `
//       )}
//     />
//   )
// );

export const HoverMenu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => <div {...props} ref={ref} className="menu hoverMenu" />
);

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => <div {...props} ref={ref} />
);

export const InputModal = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => <div {...props} ref={ref} className="inputModal" />
);

export const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.body);
};

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => <Menu {...props} ref={ref} className={className} />
);
