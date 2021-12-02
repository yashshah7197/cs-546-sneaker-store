(function ($) {
  var answerForm = $(".answerForm");

  answerForm.submit(function (event) {
    event.preventDefault();
    debugger;
    try {
      var values = {};
      $.each($(".answerForm").serializeArray(), function (i, field) {
        values[field.name] = field.value;
      });

      var requestConfig = {
        method: values["_method"],
        url: "/qAndA/" + values["_id"],
        dataType: "json",
        data: {
          answerBy: values["answerBy"],
          answer: values["answerText"],
        },
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        location.reload();
      });
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
