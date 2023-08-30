ps.subscribe("shown", function () {
  // This event occurs after the DFW overlay is shown
  var interim_init;

  s.visible = true;

  // init the standard TinyMCE instance if missing
  if (s.has_tinymce && !s.is_mce_on) {
    interim_init = function (mce, ed) {
      var el = ed.getElement(),
        old_val = el.value,
        settings = tinyMCEPreInit.mceInit[s.editor_id];

      if (settings && settings.wpautop && typeof switchEditors != "undefined")
        el.value = switchEditors.wpautop(el.value);

      ed.onInit.add(function (ed) {
        ed.hide();
        ed.getElement().value = old_val;
        tinymce.onAddEditor.remove(interim_init);
      });
    };

    tinymce.onAddEditor.add(interim_init);
    tinyMCE.init(tinyMCEPreInit.mceInit[s.editor_id]);

    s.is_mce_on = true;
  }

  wpActiveEditor = "wp_mce_fullscreen";
});

ps.subscribe("hide", function () {
  // This event occurs before the overlay blocks DFW.
  var htmled_is_hidden = $("#" + s.editor_id).is(":hidden");
  // Make sure the correct editor is displaying.
  if (s.has_tinymce && s.mode === "tinymce" && !htmled_is_hidden) {
    switchEditors.go(s.editor_id, "tmce");
  } else if (s.mode === "html" && htmled_is_hidden) {
    switchEditors.go(s.editor_id, "html");
  }

  // Save content must be after switchEditors or content will be overwritten. See #17229.
  api.savecontent();

  $(document).unbind(".fullscreen");
  $(s.textarea_obj).unbind(".grow");

  if (s.has_tinymce && s.mode === "tinymce")
    tinyMCE.execCommand("wpFullScreenSave");

  if (s.title_id) set_title_hint($("#" + s.title_id));

  s.qt_canvas.value = s.textarea_obj.value;
});

ps.subscribe("hiding", function () {
  // This event occurs while the overlay blocks the DFW UI.

  $(document.body).removeClass("fullscreen-active");
  scrollTo(0, s.orig_y);
  $("#wpadminbar").show();
});

ps.subscribe("hidden", function () {
  // This event occurs after DFW is removed.
  s.visible = false;
  $("#wp_mce_fullscreen, #wp-fullscreen-title").removeAttr("style");

  if (s.has_tinymce && s.is_mce_on) tinyMCE.execCommand("wpFullScreenClose");

  s.textarea_obj.value = "";
  api.oldheight = 0;
  wpActiveEditor = s.editor_id;
});
