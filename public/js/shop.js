(function ($) {
  //var answerForm = $("#answerForm");
  var answerForm = $(".answerForm");

  answerForm.submit(function (event) {
    event.preventDefault();
    try {
      alert("Submit");
    } catch (e) {
      console.log(e);
    }
  });

  //Function to check for Input string
  function checkInputStr(str, varName) {
    if (str == undefined) {
      throw `${varName || "Input string"} is undefined.`;
    }
    checkIsChar(str, varName);
    if (str.trim().length == 0) {
      throw `${varName || "Input string"} is empty.`;
    }
  }

  //Function to check for valid string
  function checkIsChar(str, varName) {
    if (typeof str != "string") {
      throw `${varName || "Given variable"} is not a valid string.`;
    }
  }
})(window.jQuery);
