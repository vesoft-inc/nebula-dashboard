import { Root, createRoot } from 'react-dom/client';

function ModalWrapper<T>(Component: React.FC<T>) {

  const modalRoot = document.createElement('div');
  let appRoot: Root;

  const destroyContainer = () => {
    appRoot.unmount();
  }

  const hide = () => {
    setTimeout(() => {
      destroyContainer();
    }, 200);
  };

  const show = (props: T) => {
    appRoot = createRoot(modalRoot);
    appRoot.render((
      <Component
        afterClose={destroyContainer}
        visible 
        {...props}
        hide={hide}
      />
    ));
  };

  return {
    show,
    hide,
  };
}

export default ModalWrapper;
