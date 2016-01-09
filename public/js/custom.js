/**
 * Created by yulia on 1/8/2016.
 */
/***Search expand****/
(function (window) {
    var input = $('#nav-search-input');
    var label = $('#nav-search-label');
    console.log('label', label)
    label.click(function () {
        input.toggleClass('search-expanded');
        label.toggleClass('search-active');
        $('#search-terms').focus();
        //$('#search-terms').select();
    });
    document.addEventListener('click', function (e) {
        var clickedId = e.target.id;
        var clickedClass = e.target.className;
        console.log('clicked class: ' + clickedClass)
        console.log('Clicked id: ' + clickedId);
        if (clickedId != 'search-label'
            && clickedId != 'nav-search-label'
            && clickedId != 'nav-search-input'
            && clickedId != 'search-terms'
            && clickedId != 'glyphicon-search1'
            && clickedId != 'glyphicon-search2'
            && clickedId != 'site-search'
            && clickedClass != 'search-input-wrapper') {
            //console.log('Closing search active.');
            $('#nav-search-input').removeClass('search-expanded');
            $('#nav-search-label').removeClass('search-active');
        }
    })

}(window));



