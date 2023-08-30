attachTabsPanelListeners : function() {
    $('#menu-settings-column').bind('click', function(e) {
        var selectAreaMatch, panelId, wrapper, items,
            target = $(e.target);

        if ( target.hasClass('nav-tab-link') ) {
            panelId = /#(.*)$/.exec(e.target.href);
            if ( panelId && panelId[1] )
                panelId = panelId[1]
            else
                return false;

            wrapper = target.parents('.inside').first();

            // upon changing tabs, we want to uncheck all checkboxes
            $('input', wrapper).removeAttr('checked');

            $('.tabs-panel-active', wrapper).removeClass('tabs-panel-active').addClass('tabs-panel-inactive');
            $('#' + panelId, wrapper).removeClass('tabs-panel-inactive').addClass('tabs-panel-active');

            $('.tabs', wrapper).removeClass('tabs');
            target.parent().addClass('tabs');

            // select the search bar
            $('.quick-search', wrapper).focus();

            return false;
        } else if ( target.hasClass('select-all') ) {
            selectAreaMatch = /#(.*)$/.exec(e.target.href);
            if ( selectAreaMatch && selectAreaMatch[1] ) {
                items = $('#' + selectAreaMatch[1] + ' .tabs-panel-active .menu-item-title input');
                if( items.length === items.filter(':checked').length )
                    items.removeAttr('checked');
                else
                    items.prop('checked', true);
                return false;
            }
        } else if ( target.hasClass('submit-add-to-menu') ) {
            api.registerChange();

            if ( e.target.id && 'submit-customlinkdiv' == e.target.id )
                api.addCustomLink( api.addMenuItemToBottom );
            else if ( e.target.id && -1 != e.target.id.indexOf('submit-') )
                $('#' + e.target.id.replace(/submit-/, '')).addSelectedToMenu( api.addMenuItemToBottom );
            return false;
        } else if ( target.hasClass('page-numbers') ) {
            $.post( ajaxurl, e.target.href.replace(/.*\?/, '').replace(/action=([^&]*)/, '') + '&action=menu-get-metabox',
                function( resp ) {
                    if ( -1 == resp.indexOf('replace-id') )
                        return;

                    var metaBoxData = $.parseJSON(resp),
                    toReplace = document.getElementById(metaBoxData['replace-id']),
                    placeholder = document.createElement('div'),
                    wrap = document.createElement('div');

                    if ( ! metaBoxData['markup'] || ! toReplace )
                        return;

                    wrap.innerHTML = metaBoxData['markup'] ? metaBoxData['markup'] : '';

                    toReplace.parentNode.insertBefore( placeholder, toReplace );
                    placeholder.parentNode.removeChild( toReplace );

                    placeholder.parentNode.insertBefore( wrap, placeholder );

                    placeholder.parentNode.removeChild( placeholder );

                }
            );

            return false;
        }
    });
},
