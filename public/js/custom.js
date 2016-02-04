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

regForm = {
    firstName: [isNotEmpty],
    lastName: [isNotEmpty],
    email: [isNotEmpty, isEmail],
    nickName: [isNotEmpty],
    password: [isNotEmpty],
    confirmPass: [isNotEmpty, isMatchPass]
};
document.addEventListener('DOMContentLoaded', function () {
    var form = document.forms.regForm;
    for (var names in regForm) form.elements[names].addEventListener('blur', function (e) {

        var validationFunc = regForm[e.target.name];
        var x = true;
        for (var f in validationFunc) {
            var validationResult = validationFunc[f](this);
            if (!validationResult.result) {
                x = false;
                notValidMark(this, validationResult.message);
                break;
            } else {
                okValidMark(this);
            }
        }
    })
})


//var subBtn = $('#submit-reg')
//    subBtn.addEventListener('click', regValidation());


//function regValidation() {
//
//}

function isNotEmpty(elem) {
    var x = elem.value;
    if (x != null && x.trim() != '') {
        return {result: true};
    } else {
        return {result: false, message: 'Field is required'};
    }
}

function isEmail(mail) {
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    if (mail.value.match(mailFormat)) {
        return {result: true};
    } else {
        return {result: false, message: 'Email incorrect'};
    }
}

function isMatchPass(e) {
    var x = e.value;
    if (x === passInput.value) {
        return true;
    } else {
        return false;
    }
}
function okValidMark(t) {
    var e = t.closest('.form-group');
    var formGroupPar = e.getElementsByTagName('p')[0];
    var formGroupSpan = e.getElementsByTagName('span')[0];
    $(formGroupSpan)
        .removeClass()
        .addClass('glyphicon glyphicon-ok field-correct');
    $(formGroupPar).addClass('hidden');
}

function notValidMark(t, text) {
    var e = t.closest('.form-group');
    var formGroupPar = e.getElementsByTagName('p')[0];
    var formGroupSpan = e.getElementsByTagName('span')[0];
    $(formGroupPar).text(text);
    $(formGroupSpan)
        .removeClass()
        .addClass('glyphicon glyphicon-remove field-uncorrect');
    $(formGroupPar).removeClass('hidden');
}






