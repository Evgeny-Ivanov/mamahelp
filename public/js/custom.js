/**
 * Created by yulia on 1/8/2016.
 */
/***Site Search expand-collapse****/
(function (window) {
    var input = $('#nav-search-input');
    var label = $('.nav-search-label');
    label.click(function () {
        input.addClass('search-expanded');
        label.addClass('search-active');
        $('#search-terms').focus();
    });
    document.addEventListener('click', function (e) {
        console.log('event target: ' + $(e.target));
        console.log('closest parent: ' + $(e.target).closest('#nav-search-input').length);
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
    var pic = $('#inspiration-pic');
    console.log(pic)
    document.addEventListener('scroll', function () {
        pic.addClass('hidden')
    })
}(window));




