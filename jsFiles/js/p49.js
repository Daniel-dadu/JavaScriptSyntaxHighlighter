ps.subscribe("showToolbar", function () {
  s.toolbars.removeClass("fade-1000").addClass("fade-300");
  api.fade.In(
    s.toolbars,
    300,
    function () {
      ps.publish("toolbarShown");
    },
    true
  );
  $("#wp-fullscreen-body").addClass("wp-fullscreen-focus");
  s.toolbar_shown = true;
});

ps.subscribe("hideToolbar", function () {
  s.toolbars.removeClass("fade-300").addClass("fade-1000");
  api.fade.Out(
    s.toolbars,
    1000,
    function () {
      ps.publish("toolbarHidden");
    },
    true
  );
  $("#wp-fullscreen-body").removeClass("wp-fullscreen-focus");
});

ps.subscribe("toolbarShown", function () {
  s.toolbars.removeClass("fade-300");
});

ps.subscribe("toolbarHidden", function () {
  s.toolbars.removeClass("fade-1000");
  s.toolbar_shown = false;
});

ps.subscribe("show", function () {
  // This event occurs before the overlay blocks the UI.
  var title;

  if (s.title_id) {
    title = $("#wp-fullscreen-title").val($("#" + s.title_id).val());
    set_title_hint(title);
  }

  $("#wp-fullscreen-save input").attr("title", $("#last-edit").text());

  s.textarea_obj.value = s.qt_canvas.value;

  if (s.has_tinymce && s.mode === "tinymce")
    tinyMCE.execCommand("wpFullScreenInit");

  s.orig_y = $(window).scrollTop();
});

ps.subscribe("showing", function () {
  // This event occurs while the DFW overlay blocks the UI.
  $(document.body).addClass("fullscreen-active");
  api.refresh_buttons();

  $(document).bind("mousemove.fullscreen", function (e) {
    bounder("showToolbar", "hideToolbar", 2000, e);
  });
  bounder("showToolbar", "hideToolbar", 2000);

  api.bind_resize();
  setTimeout(api.resize_textarea, 200);

  // scroll to top so the user is not disoriented
  scrollTo(0, 0);

  // needed it for IE7 and compat mode
  $("#wpadminbar").hide();
});
