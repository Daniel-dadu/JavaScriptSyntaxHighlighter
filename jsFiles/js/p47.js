if ( s.visible )
return;

// Settings can be added or changed by defining "wp_fullscreen_settings" JS object.
// This can be done by defining it as PHP associative array, json encoding it and passing it to JS with:
// wp_add_script_before( 'wp-fullscreen', 'wp_fullscreen_settings = ' . $json_encoded_array . ';' );
if ( typeof(wp_fullscreen_settings) == 'object' )
$.extend( s, wp_fullscreen_settings );

s.editor_id = wpActiveEditor || 'content';

if ( !s.title_id ) {
if ( $('input#title').length && s.editor_id == 'content' )
    s.title_id = 'title';
else if ( $('input#' + s.editor_id + '-title').length ) // the title input field should have [editor_id]-title HTML ID to be auto detected
    s.title_id = s.editor_id + '-title';
else
    $('#wp-fullscreen-title, #wp-fullscreen-title-prompt-text').hide();
}

s.mode = $('#' + s.editor_id).is(':hidden') ? 'tinymce' : 'html';
s.qt_canvas = $('#' + s.editor_id).get(0);

if ( ! s.element )
api.ui.init();

s.is_mce_on = s.has_tinymce && typeof( tinyMCE.get(s.editor_id) ) != 'undefined';

api.ui.fade( 'show', 'showing', 'shown' );
};
