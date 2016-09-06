///******
// * regform validation
// */
// regForm = {
//     first_name: [isNotEmpty],
//     last_name: [isNotEmpty],
//     email: [isNotEmpty, isEmail],
//     username: [isNotEmpty],
//     password: [isNotEmpty],
//     password_confirm: [isNotEmpty, isMatchPass]
// };
//
// function validate(name, field) {
//     var validationFunc = regForm[name];
//     var field_valid = true;
//     for (var f in validationFunc) {
//         var validationResult = validationFunc[f](field);
//         if (!validationResult.result) {
//             field_valid = false;
//             notValidMark(field, validationResult.message);
//             break;
//         } else {
//             okValidMark(field);
//         }
//     }
//     return field_valid;
// }
// document.addEventListener('DOMContentLoaded', function () {
//     var form = document.forms.regForm;
//     for (var names in regForm) {
//         form.elements[names].addEventListener('blur', function (e) {
//             validate(e.target.name, this);
//         })
//     }
// });
//
// var validateSubmitForm = function () {
//     var form = document.forms.regForm;
//     var all_valid = true;
//     for (var name in regForm) {
//         var field_valid = validate(name, form.elements[name]);
//         if (!field_valid) {
//             all_valid = false
//         }
//     }
//     console.log('-------->>>>>' + all_valid);
//     return all_valid;
// };
//
// function isNotEmpty(elem) {
//     var x = elem.value;
//     if (x != null && x.trim() != '') {
//         return {result: true};
//     } else {
//         return {result: false, message: 'Field is required'};
//     }
// }
//
// function isEmail(mail) {
//     var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
//     if (mail.value.match(mailFormat)) {
//         return {result: true};
//     } else {
//         return {result: false, message: 'Email incorrect'};
//     }
// }
// function isMatchPass(field) {
//     var x = field.value;
//     var pass = $('#input-password').val();
//     if (x === pass) {
//         displayValid($('#' + field.id))
//         displayValid($('#input-password'))
//     } else {
//         displayNotValid($('#' + field.id))
//     }
// }
//function isEmailExist(mail) {
//    $.get("verifyEmail?email=" + mail.value, function (data) {
//        console.log(data);
//    });
//    return {result: true};
//    var request = new XMLHttpRequest();
//    request.open('GET', '/verifyEmail?email=' + mail.value, true);
//    console.log('Sending request');
//    request.send();
//    console.log('Request sent. Registering response processor...');
//    request.onreadystatechange = function() {
//        if (request.readyState === 4) {
//            console.log('Response received...');
//            if(request.status === 200) {
//                console.log(request.responseText);
//                var answer = JSON.parse(request.responseText);
//                console.log(answer);
//                if(answer.exist === true) {
//                    notValidMark(mail, 'Email is already exist');
//                }
//            }
//        }
//    };
//    console.log('Response processor registered...');
//    return {result: true};
//}



