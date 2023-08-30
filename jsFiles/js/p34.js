// Set up fixed margin for overflow, unset padding
css["padding"] = 0;
css[marginFixed] = -1 * tabsWidth + "px";
fluid.css(css);

// Build tab navigation
arrowLeft = $(
  '<div class="nav-tabs-arrow nav-tabs-arrow-left"><a>&laquo;</a></div>'
);
arrowRight = $(
  '<div class="nav-tabs-arrow nav-tabs-arrow-right"><a>&raquo;</a></div>'
);
// Attach to the document
fixed
  .wrap('<div class="nav-tabs-nav"/>')
  .parent()
  .prepend(arrowLeft)
  .append(arrowRight);

// Set the menu tabs
api.refreshMenuTabs();
// Make sure the tabs reset on resize
$(window).resize(function () {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(api.refreshMenuTabs, 200);
});
// Build arrow functions
$.each([{
    arrow : arrowLeft,
    next : "next",
    last : "first",
    operator : "+="
},{
    arrow : arrowRight,
    next : "prev",
    last : "last",
    operator : "-="
}], function(){
var that = this;
this.arrow.mousedown(function(){
    var marginFluidVal = Math.abs( parseInt( fluid.css(marginFluid) ) ),
        shift = marginFluidVal,
        css = {};

    if( "-=" == that.operator )
        shift = Math.abs( tabsWidth - fixed.width() ) - marginFluidVal;

    if( ! shift ) return;

    css[marginFluid] = that.operator + shift + 'px';
    fluid.animate( css, shift * msPerPx, "linear" );
}).mouseup(function(){
    var tab, next;
    fluid.stop(true);
    tab = tabs[that.last]();
    while( (next = tab[that.next]()) && next.length && ! next.isTabVisible() ) {
        tab = next;
    }
    tab.makeTabVisible();
});
});
},