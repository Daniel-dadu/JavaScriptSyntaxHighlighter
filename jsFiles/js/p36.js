eventOnClickMenuDelete : function(clickedEl) {
    // Delete warning AYS
    if ( confirm( navMenuL10n.warnDeleteMenu ) ) {
        window.onbeforeunload = null;
        return true;
    }
    return false;
},

eventOnClickMenuItemDelete : function(clickedEl) {
    var itemID = parseInt(clickedEl.id.replace('delete-', ''), 10);
    api.removeMenuItem( $('#menu-item-' + itemID) );
    api.registerChange();
    return false;
},
processQuickSearchQueryResponse : function(resp, req, panel) {
    var matched, newID,
    takenIDs = {},
    form = document.getElementById('nav-menu-meta'),
    pattern = new RegExp('menu-item\\[(\[^\\]\]*)', 'g'),
    $items = $('<div>').html(resp).find('li'),
    $item;

    if( ! $items.length ) {
        $('.categorychecklist', panel).html( '<li><p>' + navMenuL10n.noResultsFound + '</p></li>' );
        $('img.waiting', panel).hide();
        return;
    }

    $items.each(function(){
        $item = $(this);

        // make a unique DB ID number
        matched = pattern.exec($item.html());

        if ( matched && matched[1] ) {
            newID = matched[1];
            while( form.elements['menu-item[' + newID + '][menu-item-type]'] || takenIDs[ newID ] ) {
                newID--;
            }

            takenIDs[newID] = true;
            if ( newID != matched[1] ) {
                $item.html( $item.html().replace(new RegExp(
                    'menu-item\\[' + matched[1] + '\\]', 'g'),
                    'menu-item[' + newID + ']'
                ) );
            }
        }
    });

    $('.categorychecklist', panel).html( $items );
    $('img.waiting', panel).hide();
},

removeMenuItem : function(el) {
    var children = el.childMenuItems();

    el.addClass('deleting').animate({
            opacity : 0,
            height: 0
        }, 350, function() {
            var ins = $('#menu-instructions');
            el.remove();
            children.shiftDepthClass(-1).updateParentMenuItemDBId();
            if( ! ins.siblings().length )
                ins.removeClass('menu-instructions-inactive');
        });
},

depthToPx : function(depth) {
    return depth * api.options.menuItemDepthPerLevel;
},

pxToDepth : function(px) {
    return Math.floor(px / api.options.menuItemDepthPerLevel);
}

};

$(document).ready(function(){ wpNavMenu.init(); });