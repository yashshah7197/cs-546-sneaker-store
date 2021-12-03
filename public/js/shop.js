(function ($) {
  var answerForm = $(".answerForm");
  var questionForm = $("#questionForm");
  var reviewForm = $("#reviewForm");

  //Add review AJAX call
  reviewForm.submit(function (event) {
    event.preventDefault();
    debugger;
    try {
      var values = {};

      var x = $("#reviewForm").serializeArray();
      $.each(x, function (i, field) {
        values[field.name] = field.value;
      });

      var requestConfig = {
        method: "POST",
        url: "/reviews/",
        dataType: "json",
        data: {
          reviewedBy: values["reviewedBy"],
          reviewFor: values["reviewFor"],
          reviewTitle: values["reviewTitle"],
          reviewText: values["reviewText"],
          reviewRating: values["reviewRating"],
        },
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
    }
  });

  //Ask Question AJAX call
  questionForm.submit(function (event) {
    event.preventDefault();
    debugger;
    try {
      var values = {};

      var x = $("#questionForm").serializeArray();
      $.each(x, function (i, field) {
        values[field.name] = field.value;
      });

      var requestConfig = {
        method: "POST",
        url: "/qAndA/",
        dataType: "json",
        data: {
          qAndAFor: values["qAndAFor"],
          questionBy: values["questionBy"],
          question: values["question"],
        },
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
    }
  });

  //Answer AJAX call
  answerForm.submit(function (event) {
    event.preventDefault();
    try {
      var answerField;
      var values = {};
      var x = $(".answerForm").serializeArray();
      $.each(x, function (i, field) {
        values[field.name] = field.value;
        if (field.name == "answerText" && field.value != "") {
          answerField = field.value;
        }
      });

      var requestConfig = {
        method: values["_method"],
        url: "/qAndA/" + values["_id"],
        dataType: "json",
        data: {
          answerBy: values["answerBy"],
          //answer: values["answerText"],
          answer: answerField,
        },
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        // var newHTML = `<hr />
        //         <div>
        //           <div>Answer: ${responseMessage.answer}}</div>
        //           <div>User: ${responseMessage.answeredBy}}</div>
        //         </div>
        //         <hr />`;
        // answersDiv.append(newHTML);
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
    }
  });
})(window.jQuery);
