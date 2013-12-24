$(function () {
    $('#content').css({ "min-height": $(window).height() - ($('footer').height() + $('#wrapper header').height() + $('#tgrid-bar').height()) });
    $('#left').height($('#content').height());
    var left = ($('#wrapper').width() - $('#content').width()) / 2 - $('#left').width();
    $('#left').css({ "left": left });
    $('#right').height($('#content').height());
    $('#right').css({ "right": left });
    
    
    //$('#top').width($('#wrapper').width());
    //$('#bottom').width($('#wrapper').width());    
    document.getElementsByClassName('menu')[0].onclick = function (event) {
        var menuItems = document.getElementsByClassName('menuItem');
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].style.display = 'block';
            event.stopPropagation();
            event.cancelBubble();
            document.onclick = function () {
                for (var j = 0; j < menuItems.length; j++) {
                    menuItems[j].style.display = 'none';
                };
            };
        }
    };

})
