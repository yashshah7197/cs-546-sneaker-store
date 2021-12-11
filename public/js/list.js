(function ($) {
  var filterForm = $("#filter-form");

  //Sneaker buy client side validations
  filterForm.submit(function (event) {
    var filterFormError;
    try {
      var filterFormError = $("#filterFormError");

      filterFormError.addClass("d-none");

      var brandName = $("#brandName");
      var size = $("#size");
      var price = $("#price");

      checkArgExists(brandName.val(), "Brand Name");
      checkIsNumber(Number(size.val()), "Size");
      checkIsNumber(Number(price.val()), "Price");

      return true;
    } catch (e) {
      filterFormError.text(e);
      filterFormError.removeClass("d-none");
      return false;
    }
  });
})(window.jQuery);
