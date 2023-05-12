import React from 'react';
import ReactDOM from 'react-dom';

function ModalWrapper<T>(Component: React.FC<T>) {

  const container = document.createElement('div');
  const hide = () => {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(container);
      window.removeEventListener("popstate",hide); 
    }, 200);
  };

  const show = (props: T) => {
    ReactDOM.render(<Component visible {...props} hide={hide} />, container);
    window.addEventListener("popstate",hide); 
  };

  return {
    show,
    hide,
  };
}

export default ModalWrapper;
