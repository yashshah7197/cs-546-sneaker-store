// (function($) {
// 	// Let's start writing AJAX calls!

// $(document).ready(function(){
//     $("select").change(function(){
//         // alert("The text has been changed."+$("#size").val());
//         var nameArr = $("#size").val().split(',');
//         console.log(nameArr[0]);
//         if( $("#size").val()==0)
//         {
//             $("#notify").attr("disabled", true);
//             $("#buy").attr("disabled", true);
//         }
//         else if(nameArr[1]<=0)
//         {
//             $("#notify").attr("disabled", false);
//             $("#buy").attr("disabled", true);

//          }
//         else
//         {
//             $("#notify").attr("disabled", true);
//             $("#buy").attr("disabled", false);

//         }
//     });

//   });

//   $("#notify").click(function(event) {
//       alert("You will be Notified by Email when stock is updated.!!!!!");

//   });
// })(window.jQuery);
