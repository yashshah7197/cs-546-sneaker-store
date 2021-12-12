(function ($) {
  //var answerForm = $(".answerForm");
  var questionForm = $("#questionForm");
  var reviewForm = $("#reviewForm");
  var reviewFormError = $("#reviewFormError");
  var quesFormError = $("#quesFormError");

  var sneakerBuyForm = $("#sneakerBuyForm");

  //Sneaker buy client side validations
  sneakerBuyForm.submit(function (event) {
    var buyFormError;
    try {
      var buyFormError = $("#buyFormError");

      buyFormError.addClass("d-none");

      var sneakerId = $("#sneakerId").val();
      var sneakerPrice = $("#sneakerPrice").val();
      var sizeArr = $("#sneakerSize").val().split(",");
      var size = sizeArr[0];
      var quantity = sizeArr[1];

      checkInputStr(sneakerId, "Sneaker ID");
      checkInputStr(sneakerPrice, "Price");
      checkInputStr(size, "Size");
      checkInputStr(quantity, "Quantity");

      checkIsNumber(Number(sneakerPrice), "Price");
      checkIsNumber(Number(size), "Size");
      checkIsNumber(Number(quantity), "Quantity");
      return true;
    } catch (e) {
      buyFormError.text(e);
      buyFormError.removeClass("d-none");
      return false;
    }
  });

  //Review form submission
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
      checkInputStr(reviewRatingElem.val(), "Rating");
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
              <div class="revReportBtn">
                    <a
                      id="revReportBtn_${responseMessage._id}"
                      onClick="openReport(event)"
                      href=""
                    >Report</a></div>
              <div> Review: ${responseMessage.review}</div>
              <div id="rrBtn_${responseMessage._id}" class="rrBtn" hidden>
                    <div
                      class="alert alert-danger d-none"
                      role="alert"
                      id="rrFormError_${responseMessage._id}"
                      class="rrFormError"
                    >
                    </div>
                    <label id="rrll_${responseMessage._id}">Report Reason:</label>
                    <input type="text" id="rr_${responseMessage._id}" />
                    <button
                      id="rrB_${responseMessage._id}"
                      onclick="reportReview(event)"
                    >Submit Report</button>
                  </div>
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
          reviewErrorMsg.empty().append(errorMessage.error);
          reviewFormError.removeClass("d-none");
        });
    } catch (e) {
      //console.log(e);
      //reviewErrorMsg.empty().append(e);
      reviewFormError.text(e);
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
          window.location.reload();
        })
        .fail(function (e) {
          errorMessage = JSON.parse(e.responseText);
          quesErrorMsg.empty().append(errorMessage.error);
          quesFormError.removeClass("d-none");
        });
    } catch (e) {
      //console.log(e);
      quesFormError.text(e);
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

  $("select").change(function () {
    var nameArr = $("#sneakerSize").val().split(",");
    console.log(nameArr[0]);
    if ($("#sneakerSize").val() == 0) {
      document.getElementById("notify").hidden = true;
      $("#buy").attr("disabled", true);
    } else if (nameArr[1] <= 0) {
      document.getElementById("notify").hidden = false;
      $("#buy").attr("disabled", true);
    } else {
      document.getElementById("notify").hidden = true;
      $("#buy").attr("disabled", false);
    }
  });
})(window.jQuery);

//Answer AJAX call
function submitAnswer(event) {
  event.preventDefault();
  var ansFormError;
  try {
    var qID = event.currentTarget.id;
    qID = qID.replace("answerForm_", "");

    var ansFormError = $("#ansFormError_" + qID);

    ansFormError.addClass("d-none");

    var answerByID = $("#answerBy_" + qID).val();
    var answerText = $("#answerText_" + qID).val();

    checkInputStr(answerByID, "Answer By");
    checkInputStr(answerText, "Answer");

    var userID = $("#reviewedBy");

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
          var newHTML = `<div class="answerBlock">
                          <hr />
                          <div>
                            <div>Answer: ${responseMessage.answer.answer}</div>

                            <div class="qnaReportBtn">
                              <a
                                id="qnaReportBtn_${responseMessage.answer._id}"
                                onclick="openReport2(event)"
                                href=""
                              >Report</a></div>
                            <div>User: ${responseMessage.answer.answerBy}</div>
                            <div id="rqBtn_${responseMessage.answer._id}" class="rqBtn" hidden>
                              <div
                                class="alert alert-danger d-none"
                                role="alert"
                                id="rqFormError_${responseMessage.answer._id}"
                                class="rrFormError"
                              >
                              </div>
                              <label id="rqll_${responseMessage.answer._id}">Report Reason:</label>
                              <input type="text" id="rq_${responseMessage.answer._id}" />
                              <button
                                id="rqB_${responseMessage.answer._id}_${responseMessage._id}"
                                onclick="reportQna(event)"
                              >Submit Report</button>
                            </div>

                          </div>
                          <hr />
                        </div>`;
          $(`#answerPanel_${responseMessage._id}`).append(newHTML);
        } else {
          var newHTML = `<div class="answerBlock">
                          <hr />
                          <div>
                            <div>Answer: ${responseMessage.answer.answer}</div>

                            <div class="qnaReportBtn">
                              <a
                                id="qnaReportBtn_${responseMessage.answer._id}"
                                onclick="openReport2(event)"
                                href=""
                              >Report</a></div>
                            <div>User: ${responseMessage.answer.answerBy}</div>
                            <div id="rqBtn_${responseMessage.answer._id}" class="rqBtn" hidden>
                              <div
                                class="alert alert-danger d-none"
                                role="alert"
                                id="rqFormError_${responseMessage.answer._id}"
                                class="rrFormError"
                              >
                              </div>
                              <label id="rqll_${responseMessage.answer._id}">Report Reason:</label>
                              <input type="text" id="rq_${responseMessage.answer._id}" />
                              <button
                                id="rqB_${responseMessage.answer._id}_${responseMessage._id}"
                                onclick="reportQna(event)"
                              >Submit Report</button>
                            </div>

                          </div>
                          <hr />
                        </div>`;
          $(`#answerPanel_${responseMessage._id}`).empty().append(newHTML);
        }

        $("#answerText_" + qID).val("");
      })
      .fail(function (e) {
        errorMessage = JSON.parse(e.responseText);
        ansFormError.text(errorMessage.error);
        ansFormError.removeClass("d-none");
      });
  } catch (e) {
    ansFormError.text(e);
    ansFormError.removeClass("d-none");
  }
}

function reportReview(event) {
  try {
    let reportedBy = $("#reviewedBy").val();
    let reportFor = event.currentTarget.id.split("_");
    let reportR = $(`#rr_${reportFor[1]}`).val();

    var reportFormError = $("#rrFormError_" + reportFor[1]);

    reportFormError.addClass("d-none");

    checkInputStr(reportedBy, "Reported By");
    checkInputStr(reportFor[1], "Report For");
    checkInputStr(reportR, "Report Reason");

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
        errorMessage = JSON.parse(e.responseText);
        reportFormError.text(errorMessage.error);
        reportFormError.removeClass("d-none");
      });
    $(`#rr_${reportFor[1]}`).val("");
  } catch (e) {
    reportFormError.text(e);
    reportFormError.removeClass("d-none");
  }
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
  try {
    let reportedBy = $("#reviewedBy").val();
    let reportFor = event.currentTarget.id.split("_");

    let reportR = $(`#rq_${reportFor[1]}`).val();

    var reportFormError = $("#rqFormError_" + reportFor[1]);

    reportFormError.addClass("d-none");

    checkInputStr(reportedBy, "Reported By");
    checkInputStr(reportFor[1], "Report For");
    checkInputStr(reportR, "Report Reason");

    let request = {
      method: "POST",
      url: "/reports/",
      dataType: "json",
      data: {
        reportedBy: reportedBy,
        reportFor: reportFor[1],
        reportForQ: reportFor[2],
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
        errorMessage = JSON.parse(e.responseText);
        reportFormError.text(errorMessage.error);
        reportFormError.removeClass("d-none");
      });
    $(`#rq_${reportFor[1]}`).val("");
  } catch (e) {
    reportFormError.text(e);
    reportFormError.removeClass("d-none");
  }
}
