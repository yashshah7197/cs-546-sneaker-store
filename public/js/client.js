(function($) {

$(document).ready(function(){
    $('.alert').alert('close')
    $("select").change(function(){
        $('.alert').alert('close')
        var nameArr = $("#size").val().split(',');
        console.log(nameArr[0]);
        if( $("#size").val()==0)
        {
            document.getElementById("notify").hidden=true;
            $("#buy").attr("disabled", true);
        }
        else if(nameArr[1]<=0)
        {
            document.getElementById("notify").hidden=false;
            $("#buy").attr("disabled", true);

         }
        else
        {
            document.getElementById("notify").hidden=true;
            $("#buy").attr("disabled", false);

        }
    });

  });
  
  $("#notify").click(function(event) {
      $('.alert').alert()

  });



  

})
(window.jQuery);







