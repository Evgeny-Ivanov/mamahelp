/**
 * Created by yulia on 1/8/2016.
 */
/*** Site Search expand-collapse...*/



(function (window) {
    var input = $('#nav-search-input');
    var label = $('.nav-search-label');
    label.click(function () {
        input.addClass('search-expanded');
        label.addClass('search-active');
        $('#search-terms').focus();
    });
    document.addEventListener('click', function (e) {
        if ($(e.target).closest('#nav-search-input').length === 0
            && $(e.target).closest('#site-search-button').length === 0) {
            $('#nav-search-input').removeClass('search-expanded');
            $('.nav-search-label').removeClass('search-active');
        }
    });

    $('.glyphicon-remove').click(function () {
        $('#nav-search-input').removeClass('search-expanded');
        $('.nav-search-label').removeClass('search-active');
    });

}(window));

//var firstScroll = true;
//
//$(window).load(function () {
//    if (!userAnonymous) {
//        $(window).scroll(function () {
//            if ($(window).scrollTop() >= $('#main-img-bckgrd').height()) {
//
//
//                //$('#main-img-bckgrd').remove();
//                //$('#inspiration-pic').css("display", "none");
//                //$('#img-content').removeClass('main-img-content');
//                //$('#img-content').addClass('content-fixed-top');
//                //$('.page-content').css('margin-top', '60px');
//                //$('.page-content').addClass('page-content-backrg');
//                //console.log('------------->' + firstScroll);
//                if (firstScroll) {
//
//                        firstScroll = false;
//                        //$('#img-content').addClass('hidden');
//                    }
//                }
//
//                if (!firstScroll) {
//                    var lastScrollTop = $(window).scrollTop();
//                    $('#main-img-bckgrd').remove();
//                    $('#inspiration-pic').css("display", "none");
//                    $('#img-content').removeClass('main-img-content');
//                    $('#img-content').addClass('content-fixed-top');
//                    $('.page-content').css('margin-top', '60px');
//                    $('.page-content').addClass('page-content-backrg');
//                    $(window).scroll(function () {
//                        var st = $(this).scrollTop();
//                        console.log(st);
//                        if (st > lastScrollTop) {
//
//                            $('#img-content').addClass('hidden');
//                        } else {
//                            $('#img-content').removeClass('hidden');
//                        }
//                        lastScrollTop = st;
//                    });
//                }
//            }
//        })
//    }
//});

/***************************** Log-in form *********************************************/

function getFormObjects(form) {
    console.log(form);
    var formObjects = {};
    var inputs = $(form + ' .form-control');
    inputs.each(function (idx, input) {
        formObjects[input.id] = {
            "id": input.id,
            "name": input.name,
            "type": input.type,
            "placeholder": input.placeholder
        };
    });
    return formObjects;
}

//called from html "onblur" event on field//
function checkEmail(field) {
    if (isEmail(field.value)) {
        displayValid($('#' + field.id))
    } else {
        displayNotValid($('#' + field.id))
    }
}
function checkPass(field) {
    if (isNotEmpty($('#reg-password'))) {
        if (isMatchPass(field.value)) {
            displayValid($('#' + field.id))
        } else {
            displayNotValid($('#' + field.id))
    }
    }
}
function formValidation(form) {
    var formValid = true;
    var formObjects = getFormObjects(form);

    $.each(formObjects, function (key, value) {
        var field = $("#" + value.id);
        if (isNotEmpty(field)) {
            displayValid(field);
        } else {
            displayNotValid(field, "field is required");
            formValid = false;
        }
    })
    if (formObjects['password-confirm']) {
        var value = ($('#password-confirm').val())
        if (isMatchPass(value)) {
            displayValid($('#password-confirm'))
        } else {
            displayNotValid($('#password-confirm'))
            formValid = false;
        }
    }
    if (formObjects['login-email']) {
    console.log(formObjects['login-email'])
        var value = ($('#login-email').val())
        if (isEmail(value)) {
            displayValid($('#login-email'))
        } else {
            displayNotValid($('#login-email'))
                formValid = false;
        }
    }
    if (formObjects['reg-email']) {
        console.log(formObjects['reg-email'])
        var value = ($('#reg-email').val())
        if (isEmail(value)) {
            displayValid($('#reg-email'))
        } else {
            displayNotValid($('#reg-email'))
            formValid = false;
        }
    }


    // if (!isEmail($('#login-email').val())){
    //     displayNotValid($('#login-email'));
    //     formValid = false;
    // } else {
    //     displayValid($('#login-email'))
    // }
    //
    // if (!isEmail($('#reg-email').val())){
    //     displayNotValid($('#reg-email'));
    //     formValid = false;
    // } else {
    //     displayValid($('#reg-email'))
    // }

    return formValid;
}

function isNotEmpty(elem) {
    var x = elem.val();
    return (x != null && x.trim() != '');
}

function isEmail(mail) {
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return mail.match(mailFormat);
}

function isMatchPass(text) {
    var pass = $('#reg-password').val();
    return  (text === pass)
    // {
    //     displayValid($('#' + field.id))
    //     displayValid($('#input-password'))
    // } else {
    //     displayNotValid($('#' + field.id))
    // }
}

function displayNotValid(element, text) {
    element.removeClass('field-correct');
    element.addClass('field-incorrect');
    element.attr('placeholder', text)

}

function displayValid(element) {
    element.removeClass('field-incorrect');
    element.addClass('field-correct');
}

function clearForm(form) {
    $(form).find("input").val("").removeClass('field-incorrect').removeClass('field-correct');

}








