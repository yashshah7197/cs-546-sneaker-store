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
        var accordionReviews = $("#accordionReviews");
        var newHTML = `<div class="accordion-item">
          <h4 class="accordion-header" id="heading_${responseMessage._id}">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse_${responseMessage._id}"
              aria-expanded="true"
              aria-controls="collapse_${responseMessage._id}"
            >
              <div>${responseMessage.title}</div>
              <div>&nbsp| &nbsp </div>
              <div> Rating : ${responseMessage.rating}</div>
            </button>
          </h4>
          <div
            id="collapse_${responseMessage._id}"
            class="accordion-collapse collapse show"
            aria-labelledby="heading_${responseMessage._id}"
            data-bs-parent="#accordionReviews"
          >
            <div class="accordion-body">
              <div> Name : ${responseMessage.reviewedBy} </div>
              <div> ${responseMessage.review}</div>
            </div>
          </div>
        </div>`;
        accordionReviews.append(newHTML);
        $("#collapsePostReview").removeClass("show");
        $("#reviewTitle").val("");
        $("#reviewText").val("");
        $("#reviewRating").val("");

        //window.location.reload();
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
        var newHTML = `<div class="accordion-item">
          <h4 class="accordion-header" id="heading_${responseMessage._id}">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse_${responseMessage._id}"
              aria-expanded="true"
              aria-controls="collapse_${responseMessage._id}"
            >
              <div>${responseMessage.question}</div>
              <div>&nbsp| &nbsp </div>
              <div> User : ${responseMessage.questionBy}</div>
            </button>
          </h4>
          <div
            id="collapse_${responseMessage._id}"
            class="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionQ"
          >

          <div class="accordion-body" id="answerBody_${responseMessage._id}">
              <h4>Answers</h4>
              <div id="answerPanel_${responseMessage._id}">
                  <hr />
                  <div>No answers</div>
                  <hr />
              </div>

              <form class="answerForm" id="answerForm_${responseMessage._id}" method="POST">
                <div class="mb-3">
                  <label for="answerText" class="form-label">Answer this
                    question</label>
                  <input
                    type="text"
                    name="answerText"
                    class="form-control"
                    id="answerText_${responseMessage._id}"
                  />
                  
                  <input
                    type="hidden"
                    value="User1"
                    name="answerBy"
                    id="answerBy_${responseMessage._id}"
                  />
                  <input
                    type="hidden"
                    name="_method"
                    value="put"
                    id="method_${responseMessage._id}"
                  />
                  <input type="submit" value="Submit" />
                </div>
              </form>
            </div>
          </div>
        </div>`;
        $("#accordionQ").append(newHTML);
        $("#collapsePostQ").removeClass("show");
        $("#question").val("");
      });
    } catch (e) {
      console.log(e);
    }
  });

  //Answer AJAX call
  answerForm.submit(function (event) {
    event.preventDefault();
    try {
      var qID = event.target.id;
      qID = qID.replace("answerForm_", "");
      var requestConfig = {
        method: $("#method_" + qID).val(),
        url: "/qAndA/" + qID,
        dataType: "json",
        data: {
          answerBy: $("#answerBy_" + qID).val(),
          //answer: values["answerText"],
          answer: $("#answerText_" + qID).val(),
        },
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        if ($(`#answerPanel_${responseMessage._id} .answerBlock`).length > 0) {
          var newHTML = `<hr />
                  <div>
                    <div>Answer: ${responseMessage.answer.answer}</div>
                    <div>User: ${responseMessage.answer.answeredBy}</div>
                  </div>
                  <hr />`;
          $(`#answerPanel_${responseMessage._id}`).append(newHTML);
        } else {
          var newHTML = `<hr />
                  <div>
                    <div>Answer: ${responseMessage.answer.answer}</div>
                    <div>User: ${responseMessage.answer.answeredBy}</div>
                  </div>
                  <hr />`;
          $(`#answerPanel_${responseMessage._id}`).empty().append(newHTML);
        }

        $("#answerText_" + qID).val("");
      });
    } catch (e) {
      console.log(e);
    }
  });
})(window.jQuery);