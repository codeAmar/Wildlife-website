// $(document).ready(function(){
//     var email,amount;
//     $(".donation-type-form").submit(function(){
//         email=$('#email');
//         amount = $("input[name='Donation-amount']");
//         $(".mail-delivery-status").text("Sending E-mail...Please wait");
//         $.get("http://localhost:3000/thanks",{to:email,subject:"thanks for donating",amount:amount},function(data){
//         if(data=="sent"){
//             $(".mail-delivery-status").empty().html("Email is been sent at ");
//         }});
//     });
// });
// $(document).ready(function() {
//   $('#donation-type-form').submit(function() {
//     $(this).css('color','red');
//     $(this).ajaxSubmit({
//       error: function(xhr) {
//         status('Error: ' + xhr.status);
//       },
//      success: function(response) {
//        alert(response.responseDesc);
//      }
//     });
//     return false;
//   });
// });
