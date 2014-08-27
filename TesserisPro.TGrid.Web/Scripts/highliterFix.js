$(function () {
    $(".editor-container").keypress(function (event) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
    });
    $(".editor-container").keydown(function (event) {
        return false;
    });
})