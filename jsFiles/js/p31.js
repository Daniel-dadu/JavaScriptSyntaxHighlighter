addItemToMenu : function(menuItem, processMethod, callback) {
    var menu = $('#menu').val(),
        nonce = $('#menu-settings-column-nonce').val();

    processMethod = processMethod || function(){};
    callback = callback || function(){};

    params = {
        'action': 'add-menu-item',
        'menu': menu,
        'menu-settings-column-nonce': nonce,
        'menu-item': menuItem
    };

    $.post( ajaxurl, params, function(menuMarkup) {
        var ins = $('#menu-instructions');
        processMethod(menuMarkup, params);
        if( ! ins.hasClass('menu-instructions-inactive') && ins.siblings().length )
            ins.addClass('menu-instructions-inactive');
        callback();
    });
},

attachUnsavedChangesListener : function() {
    $('#menu-management input, #menu-management select, #menu-management, #menu-management textarea').change(function(){
        api.registerChange();
    });

    if ( 0 != $('#menu-to-edit').length ) {
        window.onbeforeunload = function(){
            if ( api.menusChanged )
                return navMenuL10n.saveAlert;
        };
    } else {
        // Make the post boxes read-only, as they can't be used yet
        $('#menu-settings-column').find('input,select').prop('disabled', true).end().find('a').attr('href', '#').unbind('click');
    }
},