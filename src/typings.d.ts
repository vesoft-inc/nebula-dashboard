declare module '*.module.less' {
  const content: { [className: string]: string };
  export default content;
}

declare var VERSION_TYPE: any;