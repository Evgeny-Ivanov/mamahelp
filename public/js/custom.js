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

var form = document.forms.regForm;
var firstNameInput = form.elements.firstName;
var lastNameInput = form.elements.lastName;
var emailInput = form.elements.email;
var nickInput = form.elements.nickName;
var passInput = form.elements.password;
var confirm = form.elements.confirmPass;

firstNameInput.addEventListener('blur', function () {
    if (checkIfEmpty(this)) {
        console.log('FirstName field validation passed');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-ok field-correct');
        $(formGroupPar).addClass('hidden');

    } else {
        console.log('empty field');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-remove field-uncorrect');
        $(formGroupPar).removeClass('hidden');
    }
});

lastNameInput.addEventListener('blur', function () {
    if (checkIfEmpty(this)) {
        console.log('LastName field validation passed');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-ok field-correct');
        $(formGroupPar).addClass('hidden');

    } else {
        console.log('empty field');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-remove field-uncorrect');
        $(formGroupPar).removeClass('hidden');
    }
});

emailInput.addEventListener('blur', function () {
    if (checkIfEmpty(this) && validateEmail(this)) {
        console.log('emailInput field validation passed');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-ok field-correct');
        $(formGroupPar).addClass('hidden');

    } else {
        console.log('empty field');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-remove field-uncorrect');
        $(formGroupPar).removeClass('hidden');
    }
});

nickInput.addEventListener('blur', function () {
    if (checkIfEmpty(this)) {
        console.log('nickInput field validation passed');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-ok field-correct');
        $(formGroupPar).addClass('hidden');

    } else {
        console.log('empty field');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-remove field-uncorrect');
        $(formGroupPar).removeClass('hidden');
    }
});

passInput.addEventListener('blur', function () {
    if (checkIfEmpty(this)) {
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-ok field-correct');
        $(formGroupPar).addClass('hidden');

    } else {
        console.log('empty field');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-remove field-uncorrect');
        $(formGroupPar).removeClass('hidden');
    }
});

confirm.addEventListener('blur', function () {
    if (checkIfEmpty(this) && passConfirm(this)) {
        console.log('passInput field validation passed');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-ok field-correct');
        $(formGroupPar).addClass('hidden');

    } else {
        console.log('empty field');
        var e = this.closest('.form-group');
        var formGroupPar = e.getElementsByTagName('p')[0];
        var formGroupSpan = e.getElementsByTagName('span')[0];
        $(formGroupSpan)
            .removeClass()
            .addClass('glyphicon glyphicon-remove field-uncorrect');
        $(formGroupPar).removeClass('hidden');
    }
});


function checkIfEmpty(elem) {
    var x = elem.value;
    if (x == null || x.trim() == '') {
        return false;
    } else {
        return true;
    }
}

function validateEmail(mail) {
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    if (mail.value.match(mailFormat)) {
        return true;
    } else {
        return false;
    }
}

function passConfirm(e) {
    var x = e.value;
    if (x === passInput.value) {
        return true;
    } else {
        return false;
    }
}







