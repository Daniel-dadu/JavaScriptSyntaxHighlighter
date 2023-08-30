eventOnClickEditLink : function(clickedEl) {
    var settings, item,
    matchedSection = /#(.*)$/.exec(clickedEl.href);
    if ( matchedSection && matchedSection[1] ) {
        settings = $('#'+matchedSection[1]);
        item = settings.parent();
        if( 0 != item.length ) {
            if( item.hasClass('menu-item-edit-inactive') ) {
                if( ! settings.data('menu-item-data') ) {
                    settings.data( 'menu-item-data', settings.getItemData() );
                }
                settings.slideDown('fast');
                item.removeClass('menu-item-edit-inactive')
                    .addClass('menu-item-edit-active');
            } else {
                settings.slideUp('fast');
                item.removeClass('menu-item-edit-active')
                    .addClass('menu-item-edit-inactive');
            }
            return false;
        }
    }
},

eventOnClickCancelLink : function(clickedEl) {
    var settings = $(clickedEl).closest('.menu-item-settings');
    settings.setItemData( settings.data('menu-item-data') );
    return false;
},

eventOnClickMenuSave : function(clickedEl) {
    var locs = '',
    menuName = $('#menu-name'),
    menuNameVal = menuName.val();
    // Cancel and warn if invalid menu name
    if( !menuNameVal || menuNameVal == menuName.attr('title') || !menuNameVal.replace(/\s+/, '') ) {
        menuName.parent().addClass('form-invalid');
        return false;
    }
    // Copy menu theme locations
    $('#nav-menu-theme-locations select').each(function() {
        locs += '<input type="hidden" name="' + this.name + '" value="' + $(this).val() + '" />';
    });
    $('#update-nav-menu').append( locs );
    // Update menu item position data
    api.menuList.find('.menu-item-data-position').val( function(index) { return index + 1; } );
    window.onbeforeunload = null;

    return true;
},