(function ($) {
  var searchForm = $("#searchForm");

  //Sneaker buy client side validations
  searchForm.submit(function (event) {
    var searchFormError;
    try {
      var searchFormError = $("#searchFormError");

      searchFormError.addClass("d-none");

      var searchTerm = $("#searchTerm");

      checkInputStr(searchTerm.val(), "Search Term");

      return true;
    } catch (e) {
      searchFormError.text(e);
      searchFormError.removeClass("d-none");
      return false;
    }
  });
})(window.jQuery);
