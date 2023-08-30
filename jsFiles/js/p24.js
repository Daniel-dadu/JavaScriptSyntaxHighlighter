initToggles : function() {
    // init postboxes
    postboxes.add_postbox_toggles('nav-menus');

    // adjust columns functions for menus UI
    columns.useCheckboxesForHidden();
    columns.checked = function(field) {
        $('.field-' + field).removeClass('hidden-field');
    }
    columns.unchecked = function(field) {
        $('.field-' + field).addClass('hidden-field');
    }
    // hide fields
    api.menuList.hideAdvancedMenuItemFields();
},

initSortables : function() {
    var currentDepth = 0, originalDepth, minDepth, maxDepth,
        prev, next, prevBottom, nextThreshold, helperHeight, transport,
        menuEdge = api.menuList.offset().left,
        body = $('body'), maxChildDepth,
        menuMaxDepth = initialMenuMaxDepth();

    // Use the right edge if RTL.
    menuEdge += api.isRTL ? api.menuList.width() : 0;

    api.menuList.sortable({
        handle: '.menu-item-handle',
        placeholder: 'sortable-placeholder',
        start: function(e, ui) {
            var height, width, parent, children, tempHolder;

            // handle placement for rtl orientation
            if ( api.isRTL )
                ui.item[0].style.right = 'auto';

            transport = ui.item.children('.menu-item-transport');

            // Set depths. currentDepth must be set before children are located.
            originalDepth = ui.item.menuItemDepth();
            updateCurrentDepth(ui, originalDepth);

            // Attach child elements to parent
            // Skip the placeholder
            parent = ( ui.item.next()[0] == ui.placeholder[0] ) ? ui.item.next() : ui.item;
            children = parent.childMenuItems();
            transport.append( children );

            // Update the height of the placeholder to match the moving item.
            height = transport.outerHeight();
            // If there are children, account for distance between top of children and parent
            height += ( height > 0 ) ? (ui.placeholder.css('margin-top').slice(0, -2) * 1) : 0;
            height += ui.helper.outerHeight();
            helperHeight = height;
            height -= 2; // Subtract 2 for borders
            ui.placeholder.height(height);

            // Update the width of the placeholder to match the moving item.
            maxChildDepth = originalDepth;
            children.each(function(){
                var depth = $(this).menuItemDepth();
                maxChildDepth = (depth > maxChildDepth) ? depth : maxChildDepth;
            });
            width = ui.helper.find('.menu-item-handle').outerWidth(); // Get original width
            width += api.depthToPx(maxChildDepth - originalDepth); // Account for children
            width -= 2; // Subtract 2 for borders
            ui.placeholder.width(width);

            // Update the list of menu items.
            tempHolder = ui.placeholder.next();
            tempHolder.css( 'margin-top', helperHeight + 'px' ); // Set the margin to absorb the placeholder
            ui.placeholder.detach(); // detach or jQuery UI will think the placeholder is a menu item
            $(this).sortable( "refresh" ); // The children aren't sortable. We should let jQ UI know.
            ui.item.after( ui.placeholder ); // reattach the placeholder.
            tempHolder.css('margin-top', 0); // reset the margin

            // Now that the element is complete, we can update...
            updateSharedVars(ui);
        },