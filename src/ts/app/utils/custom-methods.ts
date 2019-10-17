export const enInput = (() => {
  // add has-value class
  const handleFocus = e => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add("has-focus");
  };

  // remove has-value class
  const handleBlur = e => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.remove("has-focus");

    if (target.value) {
      targetWrapper.classList.add("has-value");
    } else {
      targetWrapper.classList.remove("has-value");
    }
  };

  // register events
  const bindEvents = element => {
    const floatField = element.querySelector("input, textarea");
    floatField.addEventListener("focus", handleFocus);
    floatField.addEventListener("blur", handleBlur);
  };

  // get DOM elements
  const init = () => {
    console.log("Init Fired");
    const formInput = document.querySelectorAll(
      ".en__field--text, .en__field--textarea"
    );
    formInput.forEach(element => {
      if (element.querySelector("input, textarea").value) {
        element.parentNode.parentNode.classList.add("has-value");
      }
      bindEvents(element);
    });
  };

  return {
    init: init
  };
})();
