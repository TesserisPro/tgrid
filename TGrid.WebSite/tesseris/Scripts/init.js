$(function () {
    $('#content').css({ "min-height": $(window).height() - ($('footer').height() + $('#wrapper header').height() + $('#tgrid-bar').height()) });
    $('#left').height($('#content').height());
    var left = ($('#wrapper').width() - $('#content').width()) / 2 - $('#left').width();
    $('#left').css({ "left": left });
    $('#right').height($('#content').height());
    $('#right').css({ "right": left });
    
    
    //$('#top').width($('#wrapper').width());
    //$('#bottom').width($('#wrapper').width());    

    $('#list ul li a').click(function () {
        $('#list ul li a').removeClass('active');
        $(this).addClass('active');
    });
  
    $("#SimpleGridWithoutPaging").trigger('click');
})
