import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./ModalExample.css";

// These two containers are siblings in the DOM
// const AppRoot = document.createElement("div");
// AppRoot.classList.add("app-root");

// Let's create a Modal component that is an abstraction around
// the portal API.
const Modal = (props: any) => {
  const el = document.createElement("div");

  useEffect(() => {
    // ModalRoot.appendChild(el);
    // return () => {
    //   ModalRoot.removeChild(el);
    // };
  }, []);

  // Use a portal to render the children into the element
  return ReactDOM.createPortal(
    // Any valid React child: JSX, strings, arrays, etc.
    props.children,
    // A DOM element
    el
  );
};

// The Modal component is a normal React component, so we can
// render it wherever we like without needing to know that it's
// implemented with portals.
export const ModalExamele = () => {
  const [state, setState] = useState({ showModal: false });

  const handleShow = () => {
    setState({ showModal: true });
  };

  const handleHide = () => {
    setState({ showModal: false });
  };

  // Show a Modal on click.
  // (In a real app, don't forget to use ARIA attributes
  // for accessibility!)
  const modal = state.showModal ? (
    <Modal>
      <div className="modal">
        <div>
          With a portal, we can render content into a different part of the DOM,
          as if it were any other React child.
        </div>
        This is being rendered inside the #modal-container div.
        <button onClick={handleHide}>Hide modal</button>
      </div>
    </Modal>
  ) : null;

  return (
    <div>
      <div className="modalExample">
        This div has overflow: hidden.
        <button onClick={handleShow}>Show modal</button>
        {modal}
      </div>
    </div>
  );
};
