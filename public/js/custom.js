/**
 * Created by yulia on 1/8/2016.
 */
/***Search expand****/
(function (window) {
    var input = $('#nav-search-input');
    var label = $('#nav-search-label');
    console.log('label', label);
    label.click(function () {
        input.addClass('search-expanded');
        label.addClass('search-active');
        $('#search-terms').focus();
        setUnsensitive(input);
    });
    document.addEventListener('click', function (e) {
        //var clickedId = e.target.id;
        var clickedClass = e.target.className;
        console.log('clicked class: ' + clickedClass);
        if (clickedClass.indexOf('js-click-unsensitive') === -1) {
            $('#nav-search-input').removeClass('search-expanded');
            $('#nav-search-label').removeClass('search-active');
        }

        /*if (clickedId != 'search-label'
            && clickedId != 'nav-search-label'
         && clickedId != 'nav-search-input'
         && clickedId != 'search-terms'
         && clickedId != 'glyphicon-search1'
         && clickedId != 'glyphicon-search2'
         && clickedId != 'site-search'
         && clickedClass != 'search-input-wrapper') {
         console.log('Closing search active.');
         $('#nav-search-input').removeClass('search-expanded');
         $('#nav-search-label').removeClass('search-active');
         }*/

    })

}(window));

function setUnsensitive(element) {
    console.log('setting class unsencitive to element: ' + element);
    element.find('*').addClass('js-click-unsensitive');
    element.addClass('js-click-unsensitive');
}

