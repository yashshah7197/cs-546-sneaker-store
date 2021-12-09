// (function ($) {
//   // Let's start writing AJAX calls!

//   $(document).ready(function () {
//     $(".alert").alert("close");
//     $("select").change(function () {
//       $(".alert").alert("close");

//       // alert("The text has been changed."+$("#size").val());
//       var nameArr = $("#size").val().split(",");
//       console.log(nameArr[0]);
//       if ($("#size").val() == 0) {
//         document.getElementById("notify").hidden = true;
//         $("#buy").attr("disabled", true);
//       } else if (nameArr[1] <= 0) {
//         document.getElementById("notify").hidden = false;
//         $("#buy").attr("disabled", true);

//         //          }
//         //         else
//         //         {
//         //             $("#notify").attr("disabled", true);
//         //             $("#buy").attr("disabled", false);
//       } else {
//         document.getElementById("notify").hidden = true;
//         $("#buy").attr("disabled", false);
//       }
//     });
//   });
//   $("#buy").click(function (event) {
//     alert("Order has been Placed!");
//   });

//   $("#notify").click(function (event) {
//     $(".alert").alert();
//   });
// })(window.jQuery);
