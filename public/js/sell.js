(function ($) {
  var sellForm = $("#sellForm");

  //Sneaker buy client side validations
  sellForm.submit(function (event) {
    var sellFormError;
    try {
      var sellFormError = $("#sellFormError");

      sellFormError.addClass("d-none");

      var brandName = $("brandName");
      var modelName = $("modelName");
      var size7 = $("size7");
      var size8 = $("size8");
      var size9 = $("size9");
      var size10 = $("size10");
      var size11 = $("size11");
      var size12 = $("size12");
      var price = $("price");
      var image = $("image");

      checkInputStr(brandName, "Brand Name");
      checkInputStr(modelName, "Model Name");
      checkIsNumber(Number(size7), "size7");
      checkIsNumber(Number(size8), "size8");
      checkIsNumber(Number(size9), "size9");
      checkIsNumber(Number(size10), "size10");
      checkIsNumber(Number(size11), "size11");
      checkIsNumber(Number(size12), "size12");
      checkIsNumber(Number(price), "Price");
      //checkIsImage(image, "Image");

      return true;
    } catch (e) {
      sellFormError.text(e);
      sellFormError.removeClass("d-none");
      return false;
    }
  });
})(window.jQuery);
