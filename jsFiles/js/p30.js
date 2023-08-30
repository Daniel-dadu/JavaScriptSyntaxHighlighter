addCustomLink : function( processMethod ) {
    var url = $('#custom-menu-item-url').val(),
        label = $('#custom-menu-item-name').val();

    processMethod = processMethod || api.addMenuItemToBottom;

    if ( '' == url || 'http://' == url )
        return false;

    // Show the ajax spinner
    $('.customlinkdiv img.waiting').show();
    this.addLinkToMenu( url, label, processMethod, function() {
        // Remove the ajax spinner
        $('.customlinkdiv img.waiting').hide();
        // Set custom link form back to defaults
        $('#custom-menu-item-name').val('').blur();
        $('#custom-menu-item-url').val('http://');
    });
},


addLinkToMenu : function(url, label, processMethod, callback) {
    processMethod = processMethod || api.addMenuItemToBottom;
    callback = callback || function(){};

    api.addItemToMenu({
        '-1': {
            'menu-item-type': 'custom',
            'menu-item-url': url,
            'menu-item-title': label
        }
    }, processMethod, callback);
},
