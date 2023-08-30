initTabManager : function() {
    var fixed = $('.nav-tabs-wrapper'),
        fluid = fixed.children('.nav-tabs'),
        active = fluid.children('.nav-tab-active'),
        tabs = fluid.children('.nav-tab'),
        tabsWidth = 0,
        fixedRight, fixedLeft,
        arrowLeft, arrowRight, resizeTimer, css = {},
        marginFluid = api.isRTL ? 'margin-right' : 'margin-left',
        marginFixed = api.isRTL ? 'margin-left' : 'margin-right',
        msPerPx = 2;

api.refreshMenuTabs = function( savePosition ) {
            var fixedWidth = fixed.width(),
                margin = 0, css = {};
            fixedLeft = fixed.offset().left;
            fixedRight = fixedLeft + fixedWidth;

            if( !savePosition )
                active.makeTabVisible();

            // Prevent space from building up next to the last tab if there's more to show
            if( tabs.last().isTabVisible() ) {
                margin = fixed.width() - tabsWidth;
                margin = margin > 0 ? 0 : margin;
                css[marginFluid] = margin + 'px';
                fluid.animate( css, 100, "linear" );
            }

            // Show the arrows only when necessary
            if( fixedWidth > tabsWidth )
                arrowLeft.add( arrowRight ).hide();
            else
                arrowLeft.add( arrowRight ).show();
        }