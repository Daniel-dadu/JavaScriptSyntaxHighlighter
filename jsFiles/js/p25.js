stop: function(e, ui) {
    var children, depthChange = currentDepth - originalDepth;

    // Return child elements to the list
    children = transport.children().insertAfter(ui.item);

    // Update depth classes
    if( depthChange != 0 ) {
        ui.item.updateDepthClass( currentDepth );
        children.shiftDepthClass( depthChange );
        updateMenuMaxDepth( depthChange );
    }
    // Register a change
    api.registerChange();
    // Update the item data.
    ui.item.updateParentMenuItemDBId();

    // address sortable's incorrectly-calculated top in opera
    ui.item[0].style.top = 0;

    // handle drop placement for rtl orientation
    if ( api.isRTL ) {
        ui.item[0].style.left = 'auto';
        ui.item[0].style.right = 0;
    }

    // The width of the tab bar might have changed. Just in case.
    api.refreshMenuTabs( true );
},
change: function(e, ui) {
    // Make sure the placeholder is inside the menu.
    // Otherwise fix it, or we're in trouble.
    if( ! ui.placeholder.parent().hasClass('menu') )
        (prev.length) ? prev.after( ui.placeholder ) : api.menuList.prepend( ui.placeholder );

    updateSharedVars(ui);
},
sort: function(e, ui) {
    var offset = ui.helper.offset(),
        edge = api.isRTL ? offset.left + ui.helper.width() : offset.left,
        depth = api.negateIfRTL * api.pxToDepth( edge - menuEdge );
    // Check and correct if depth is not within range.
    // Also, if the dragged element is dragged upwards over
    // an item, shift the placeholder to a child position.
    if ( depth > maxDepth || offset.top < prevBottom ) depth = maxDepth;
    else if ( depth < minDepth ) depth = minDepth;

    if( depth != currentDepth )
        updateCurrentDepth(ui, depth);

    // If we overlap the next element, manually shift downwards
    if( nextThreshold && offset.top + helperHeight > nextThreshold ) {
        next.after( ui.placeholder );
        updateSharedVars( ui );
        $(this).sortable( "refreshPositions" );
    }
}
});