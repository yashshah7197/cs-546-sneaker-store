(function ($) {
  $("#reportLinks a").click(function (event) {
    try {
      var reportLinkError = $("#reportLinkError");
      reportLinkError.addClass("d-none");
      var linkArr = event.currentTarget.href.split("/");
      var Id = linkArr[5];
      checkInputStr(Id, "Report ID");
      return true;
    } catch (e) {
      reportLinkError.text(e);
      reportLinkError.removeClass("d-none");
      return false;
    }
  });
})(window.jQuery);
