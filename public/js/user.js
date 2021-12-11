(function ($) {
  var loginForm = $("#login-form");
  var signupForm = $("#signup-form");
  var profileForm = $("#profile-form");

  //Login Form client side validations
  loginForm.submit(function (event) {
    var loginFormError;
    try {
      var loginFormError = $("#loginFormError");

      loginFormError.addClass("d-none");

      var email = $("#email");
      var password = $("#password");

      checkIsValidEmail(email.val());
      checkIsValidPassword(password.val());
      return true;
    } catch (e) {
      loginFormError.text(e);
      loginFormError.removeClass("d-none");
      return false;
    }
  });

  //Signup Form client side validation
  signupForm.submit(function (event) {
    var signupFormError;
    try {
      var signupFormError = $("#signupFormError");

      signupFormError.addClass("d-none");

      var email = $("#email");
      var password = $("#password");

      checkIsValidEmail(email.val());
      checkIsValidPassword(password.val());
      return true;
    } catch (e) {
      signupFormError.text(e);
      signupFormError.removeClass("d-none");
      return false;
    }
  });

  //Profile Form client side validations
  profileForm.submit(function (event) {
    var profileFormError;
    try {
      var profileFormError = $("#profileFormError");

      profileFormError.addClass("d-none");

      var firstName = $("#firstName");
      var lastName = $("#lastName");
      var email = $("#email");
      var password = $("#password");
      var address = $("#address");
      var phoneNumber = $("#phoneNumber");

      checkInputStr(firstName.val(), "First Name");
      checkInputStr(lastName.val(), "Last Name");

      checkIsValidEmail(email.val());
      checkIsValidPassword(password.val());

      checkInputStr(address.val());
      checkIsValidPhoneNumber(phoneNumber.val());

      return true;
    } catch (e) {
      profileFormError.text(e);
      profileFormError.removeClass("d-none");
      return false;
    }
  });
})(window.jQuery);
