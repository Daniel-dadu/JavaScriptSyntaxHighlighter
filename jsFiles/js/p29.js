attachThemeLocationsListeners : function() {
    var loc = $('#nav-menu-theme-locations'), params = {};
    params['action'] = 'menu-locations-save';
    params['menu-settings-column-nonce'] = $('#menu-settings-column-nonce').val();
    loc.find('input[type="submit"]').click(function() {
        loc.find('select').each(function() {
            params[this.name] = $(this).val();
        });
        loc.find('.waiting').show();
        $.post( ajaxurl, params, function(r) {
            loc.find('.waiting').hide();
        });
        return false;
    });
},

attachQuickSearchListeners : function() {
    var searchTimer;

    $('.quick-search').keypress(function(e){
        var t = $(this);

        if( 13 == e.which ) {
            api.updateQuickSearchResults( t );
            return false;
        }

        if( searchTimer ) clearTimeout(searchTimer);

        searchTimer = setTimeout(function(){
            api.updateQuickSearchResults( t );
        }, 400);
    }).attr('autocomplete','off');
},

updateQuickSearchResults : function(input) {
    var panel, params,
    minSearchLength = 2,
    q = input.val();

    if( q.length < minSearchLength ) return;

    panel = input.parents('.tabs-panel');
    params = {
        'action': 'menu-quick-search',
        'response-format': 'markup',
        'menu': $('#menu').val(),
        'menu-settings-column-nonce': $('#menu-settings-column-nonce').val(),
        'q': q,
        'type': input.attr('name')
    };

    $('img.waiting', panel).show();

    $.post( ajaxurl, params, function(menuMarkup) {
        api.processQuickSearchQueryResponse(menuMarkup, params, panel);
    });
},
