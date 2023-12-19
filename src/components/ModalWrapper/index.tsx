import { Root, createRoot } from 'react-dom/client';

function ModalWrapper<T>(Component: React.FC<T>) {

  const modalRoot = document.createElement('div');
  let appRoot: Root;
  const modalRef: any = { current: null };

  const destroyContainer = () => {
    appRoot.unmount();
  }

  const hide = () => {
    modalRef.current?.close();
    setTimeout(() => {
      destroyContainer();
    }, 200);
  };

  const show = (props: T) => {
    appRoot = createRoot(modalRoot);
    appRoot.render((
      <Component
        afterClose={destroyContainer}
        ref={ref => modalRef.current = ref}
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
