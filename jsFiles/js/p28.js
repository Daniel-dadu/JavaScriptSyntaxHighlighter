setupInputWithDefaultTitle : function() {
    var name = 'input-with-default-title';

    $('.' + name).each( function(){
        var $t = $(this), title = $t.attr('title'), val = $t.val();
        $t.data( name, title );

        if( '' == val ) $t.val( title );
        else if ( title == val ) return;
        else $t.removeClass( name );
    }).focus( function(){
        var $t = $(this);
        if( $t.val() == $t.data(name) )
            $t.val('').removeClass( name );
    }).blur( function(){
        var $t = $(this);
        if( '' == $t.val() )
            $t.addClass( name ).val( $t.data(name) );
    });
},