(function ($) {
  //var answerForm = $(".answerForm");
  var questionForm = $("#questionForm");
  var reviewForm = $("#reviewForm");
  var reviewFormError = $("#reviewFormError");
  var reviewErrorMsg = $("#reviewErrorMsg");
  var quesFormError = $("#quesFormError");
  var quesErrorMsg = $("#quesErrorMsg");

  // var sneakerBuyForm = $("#sneakerBuyForm");

  // sneakerBuyForm.submit(function (event) {
  //   var buyFormError;
  //   var buyErrorMsg;
  //   try {
  //     var buyFormError = $("#buyFormError");
  //     var buyErrorMsg = $("#buyErrorMsg");
  //     var size = $("#size").val();
  //     checkIsNumber(Number(reviewRatingElem.val()), "Rating");
  //     return true;
  //   } catch (e) {
  //     buyFormError.empty().append(e);
  //     buyErrorMsg.removeClass("d-none");
  //     return false;
  //   }
  // });

  //Add review AJAX call
  reviewForm.submit(function (event) {
    event.preventDefault();
    try {
      reviewFormError.addClass("d-none");
      var reviewedByElem = $("#reviewedBy");
      var reviewForElem = $("#reviewFor");
      var reviewTitleElem = $("#reviewTitle");
      var reviewTextElem = $("#reviewText");
      var reviewRatingElem = $("#reviewRating");

      checkInputStr(reviewedByElem.val(), "reviewedBy");
      checkInputStr(reviewForElem.val(), "reviewFor");
      checkInputStr(reviewTitleElem.val(), "Title");
      checkInputStr(reviewTextElem.val(), "Review");
      checkIsNumber(Number(reviewRatingElem.val()), "Rating");
      checkRating(Number(reviewRatingElem.val()));

      var requestConfig = {
        method: "POST",
        url: "/reviews/",
        dataType: "json",
        data: {
          reviewedBy: reviewedByElem.val(),
          reviewFor: reviewForElem.val(),
          reviewTitle: reviewTitleElem.val(),
          reviewText: reviewTextElem.val(),
          reviewRating: reviewRatingElem.val(),
        },
      };

      $.ajax(requestConfig)
        .then(function (responseMessage) {
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
              ${responseMessage.title} - Rating : ${responseMessage.rating}
            </button>
          </h4>
          <div
            id="collapse_${responseMessage._id}"
            class="accordion-collapse collapse"
            aria-labelledby="heading_${responseMessage._id}"
            data-bs-parent="#accordionReviews"
          >
            <div class="accordion-body">
              <div> User: ${responseMessage.reviewedBy} </div>
              <div> Review: ${responseMessage.review}</div>
            </div>
          </div>
        </div>`;
          accordionReviews.append(newHTML);
          $("#collapsePostReview").removeClass("show");
          $("#reviewTitle").val("");
          $("#reviewText").val("");
          $("#reviewRating").val("");
        })
        .fail(function (e) {
          errorMessage = JSON.parse(e.responseText);
          reviewErrorMsg.empty().append(errorMessage.Error.message);
          reviewFormError.removeClass("d-none");
        });
    } catch (e) {
      //console.log(e);
      reviewErrorMsg.empty().append(e);
      reviewFormError.removeClass("d-none");
    }
  });

  //Ask Question AJAX call
  questionForm.submit(function (event) {
    event.preventDefault();
    try {
      quesFormError.addClass("d-none");
      var values = {};

      var x = $("#questionForm").serializeArray();
      $.each(x, function (i, field) {
        values[field.name] = field.value;
      });

      var qAndAForId = values["qAndAFor"];
      var questionById = values["questionBy"];
      var questionText = values["question"];

      checkInputStr(qAndAForId, "QandA ID");
      checkInputStr(questionById, "Question By");
      checkInputStr(questionText, "Question");

      var requestConfig = {
        method: "POST",
        url: "/qAndA/",
        dataType: "json",
        data: {
          qAndAFor: qAndAForId,
          questionBy: questionById,
          question: questionText,
        },
      };

      $.ajax(requestConfig)
        .then(function (responseMessage) {
          // var newHTML = `<div class="accordion-item">
          //   <h4 class="accordion-header" id="heading_${responseMessage._id}">
          //     <button
          //       class="accordion-button"
          //       type="button"
          //       data-bs-toggle="collapse"
          //       data-bs-target="#collapse_${responseMessage._id}"
          //       aria-expanded="true"
          //       aria-controls="collapse_${responseMessage._id}"
          //     >
          //     ${responseMessage.question} - User : ${responseMessage.questionBy}
          //     </button>
          //   </h4>
          //   <div
          //     id="collapse_${responseMessage._id}"
          //     class="accordion-collapse collapse"
          //     aria-labelledby="heading_${responseMessage._id}"
          //     data-bs-parent="#accordionQ"
          //   >
          //     <div class="accordion-body" id="answerBody_${responseMessage._id}">
          //       <h4>Answers</h4>
          //       <div id="answerPanel_${responseMessage._id}">
          //           <hr />
          //           <div>No answers</div>
          //           <hr />
          //       </div>

          //       <form class="answerForm" id="answerForm_${responseMessage._id}" method="POST" onclick="submitAnswer(event)">
          //         <div class="mb-3">
          //           <label for="answerText_${responseMessage._id}" class="form-label">Answer this
          //             question</label>
          //           <input
          //             type="text"
          //             name="answerText"
          //             class="form-control"
          //             id="answerText_${responseMessage._id}"
          //           />
          //           <input
          //             type="hidden"
          //             value="${responseMessage.questionBy}"
          //             name="answerBy"
          //             id="answerBy_${responseMessage._id}"
          //           />
          //           <input
          //             type="hidden"
          //             name="_method"
          //             value="put"
          //             id="method_${responseMessage._id}"
          //           />
          //           <input type="submit" value="Submit" />
          //         </div>
          //       </form>
          //     </div>
          //   </div>
          // </div>`;
          // $("#accordionQ").append(newHTML);
          // $("#collapsePostQ").removeClass("show");
          // $("#question").val("");

          window.location.reload();
        })
        .fail(function (e) {
          errorMessage = JSON.parse(e.responseText);
          quesErrorMsg.empty().append(errorMessage.Error.message);
          quesFormError.removeClass("d-none");
        });
    } catch (e) {
      //console.log(e);
      quesErrorMsg.empty().append(e);
      quesFormError.removeClass("d-none");
    }
  });

  // //Answer AJAX call
  // answerForm.submit(function (event) {
  //   event.preventDefault();
  //   try {
  //     var qID = event.target.id;
  //     qID = qID.replace("answerForm_", "");
  //     var requestConfig = {
  //       method: $("#method_" + qID).val(),
  //       url: "/qAndA/" + qID,
  //       dataType: "json",
  //       data: {
  //         answerBy: $("#answerBy_" + qID).val(),
  //         //answer: values["answerText"],
  //         answer: $("#answerText_" + qID).val(),
  //       },
  //     };

  //     $.ajax(requestConfig).then(function (responseMessage) {
  //       if ($(`#answerPanel_${responseMessage._id} .answerBlock`).length > 0) {
  //         var newHTML = `<hr />
  //                 <div>
  //                   <div>Answer: ${responseMessage.answer.answer}</div>
  //                   <div>User: ${responseMessage.answer.answeredBy}</div>
  //                 </div>
  //                 <hr />`;
  //         $(`#answerPanel_${responseMessage._id}`).append(newHTML);
  //       } else {
  //         var newHTML = `<hr />
  //                 <div>
  //                   <div>Answer: ${responseMessage.answer.answer}</div>
  //                   <div>User: ${responseMessage.answer.answeredBy}</div>
  //                 </div>
  //                 <hr />`;
  //         $(`#answerPanel_${responseMessage._id}`).empty().append(newHTML);
  //       }

  //       $("#answerText_" + qID).val("");
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });
})(window.jQuery);

//Answer AJAX call
function submitAnswer(event) {
  event.preventDefault();
  var ansFormError;
  var ansErrorMsg;
  try {
    var qID = event.currentTarget.id;
    qID = qID.replace("answerForm_", "");

    var ansFormError = $("#ansFormError_" + qID);
    var ansErrorMsg = $("#ansErrorMsg_" + qID);

    ansFormError.addClass("d-none");

    var answerByID = $("#answerBy_" + qID).val();
    var answerText = $("#answerText_" + qID).val();

    checkInputStr(answerByID, "Answer By");
    checkInputStr(answerText, "Answer");

    var requestConfig = {
      method: $("#method_" + qID).val(),
      url: "/qAndA/" + qID,
      dataType: "json",
      data: {
        answerBy: answerByID,
        answer: answerText,
      },
    };

    $.ajax(requestConfig)
      .then(function (responseMessage) {
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
      })
      .fail(function (e) {
        errorMessage = JSON.parse(e.responseText);
        ansErrorMsg.empty().append(errorMessage.Error.message);
        ansFormError.removeClass("d-none");
      });
  } catch (e) {
    ansErrorMsg.empty().append(e);
    ansFormError.removeClass("d-none");
  }
}

function reportReview(event) {
  let reportedBy = $("#reviewedBy").val();
  let reportFor = event.currentTarget.id.split("_");
  let reportR = $(`#rr_${reportFor[1]}`).val();
  let request = {
    method: "POST",
    url: "/reports/",
    dataType: "json",
    data: {
      reportedBy: reportedBy,
      reportFor: reportFor[1],
      reportReasons: reportR,
      type: "Review",
    },
  };
  $.ajax(request)
    .then(function (responseMessage) {
      alert("Review reported Successfully");
      let idx = reportFor[1];
      $(`#rrBtn_${idx}`).attr("hidden", true);
    })
    .fail(function (e) {
      console.log(e);
    });
}

function openReport(event) {
  event.preventDefault();
  let id = event.currentTarget.id.split("_");
  let idx = id[1];
  $(`#rrBtn_${idx}`).attr("hidden", false);
}

function openReport2(event) {
  event.preventDefault();
  let id = event.currentTarget.id.split("_");
  let idx = id[1];
  $(`#rqBtn_${idx}`).attr("hidden", false);
}

function reportQna(event) {
  let reportedBy = $("#reviewedBy").val();
  let reportFor = event.currentTarget.id.split("_");
  let reportR = $(`#rr_${reportFor[1]}`).val();
  let request = {
    method: "POST",
    url: "/reports/",
    dataType: "json",
    data: {
      reportedBy: reportedBy,
      reportFor: reportFor[1],
      reportReasons: reportR,
      type: "QnA",
    },
  };
  $.ajax(request)
    .then(function (responseMessage) {
      alert("Answer reported Successfully");
      let idx = reportFor[1];
      $(`#rqBtn_${idx}`).attr("hidden", true);
    })
    .fail(function (e) {
      console.log(e);
    });
}
