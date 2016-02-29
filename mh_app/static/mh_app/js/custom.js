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
/******
 * regform validation
 */
regForm = {
    first_name: [isNotEmpty],
    last_name: [isNotEmpty],
    email: [isNotEmpty, isEmail],
    username: [isNotEmpty],
    password: [isNotEmpty],
    confirmPass: [isNotEmpty, isMatchPass]
};

function validate(name, field) {
    var validationFunc = regForm[name];
    var x = true;
    for (var f in validationFunc) {
        var validationResult = validationFunc[f](field);
        if (!validationResult.result) {
            x = false;
            notValidMark(field, validationResult.message);
            break;
        } else {
            okValidMark(field);
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var form = document.forms.regForm;
    for (var names in regForm) {
        console.log(names);
        form.elements[names].addEventListener('blur', function (e) {
            validate(e.target.name, this);
        })
    }
});

document.getElementById('submit-reg').addEventListener('click', function () {
    var form = document.forms.regForm;
    for (var name in regForm) {
        validate(name, form.elements[name]);
    }
});


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

function isEmailExist(mail) {
    //$.get("verifyEmail?email=" + mail.value, function (data) {
    //    console.log(data);
    //});
    //return {result: true};
    var request = new XMLHttpRequest();
    request.open('GET', '/verifyEmail?email=' + mail.value, true);
    request.send();
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if(request.status === 200) {
                console.log(request.responseText);
            }
        }
    }

}

function isMatchPass(e) {
    var x = e.value;
    if (x === inputPass.value) {
        return {result: true};
    } else {
        return {result: false, message: 'Does not match'};
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



