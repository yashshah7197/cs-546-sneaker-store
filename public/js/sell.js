(function ($) {
  var sellForm = $("#sellForm");

  //Sneaker buy client side validations
  sellForm.submit(function (event) {
    var sellFormError;
    try {
      var sellFormError = $("#sellFormError");

      sellFormError.addClass("d-none");

      var brandName = $("#brandName");
      var modelName = $("#modelName");
      var size7 = $("#size7");
      var size8 = $("#size8");
      var size9 = $("#size9");
      var size10 = $("#size10");
      var size11 = $("#size11");
      var size12 = $("#size12");
      var price = $("#price");

      checkInputStr(brandName.val(), "Brand Name");
      checkInputStr(modelName.val(), "Model Name");

      checkInputStr(size7.val(), "size7");
      checkInputStr(size8.val(), "size8");
      checkInputStr(size9.val(), "size9");
      checkInputStr(size10.val(), "size10");
      checkInputStr(size11.val(), "size11");
      checkInputStr(size12.val(), "size12");
      checkInputStr(price.val(), "Price");

      checkIsNumber(Number(size7.val()), "size7");
      checkIsNumber(Number(size8.val()), "size8");
      checkIsNumber(Number(size9.val()), "size9");
      checkIsNumber(Number(size10.val()), "size10");
      checkIsNumber(Number(size11.val()), "size11");
      checkIsNumber(Number(size12.val()), "size12");
      checkIsNumber(Number(price.val()), "Price");
      checkSneakerQuantity(Number(size7.val()));
      checkSneakerQuantity(Number(size8.val()));
      checkSneakerQuantity(Number(size9.val()));
      checkSneakerQuantity(Number(size10.val()));
      checkSneakerQuantity(Number(size11.val()));
      checkSneakerQuantity(Number(size12.val()));
      checkPrice(Number(price.val()), "Price");

      return true;
    } catch (e) {
      sellFormError.text(e);
      sellFormError.removeClass("d-none");
      return false;
    }
  });
})(window.jQuery);
