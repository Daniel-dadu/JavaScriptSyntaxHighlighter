attachMenuEditListeners : function() {
    var that = this;
    $('#update-nav-menu').bind('click', function(e) {
        if ( e.target && e.target.className ) {
            if ( -1 != e.target.className.indexOf('item-edit') ) {
                return that.eventOnClickEditLink(e.target);
            } else if ( -1 != e.target.className.indexOf('menu-save') ) {
                return that.eventOnClickMenuSave(e.target);
            } else if ( -1 != e.target.className.indexOf('menu-delete') ) {
                return that.eventOnClickMenuDelete(e.target);
            } else if ( -1 != e.target.className.indexOf('item-delete') ) {
                return that.eventOnClickMenuItemDelete(e.target);
            } else if ( -1 != e.target.className.indexOf('item-cancel') ) {
                return that.eventOnClickCancelLink(e.target);
            }
        }
    });
    $('#add-custom-links input[type="text"]').keypress(function(e){
        if ( e.keyCode === 13 ) {
            e.preventDefault();
            $("#submit-customlinkdiv").click();
        }
    });
},
