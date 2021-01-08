const sendIframeHeight = (frameId: string) => {
  let height = document.body.offsetHeight;
  window.parent.postMessage(
    {
      frameHeight: height,
      enID: frameId
    },
    "*"
  );
  console.log("Sending height... ", height); // check the message is being sent correctly
};
export default sendIframeHeight;
