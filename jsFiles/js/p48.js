api.save = function () {
  var hidden = $("#hiddenaction"),
    old = hidden.val(),
    spinner = $("#wp-fullscreen-save img"),
    message = $("#wp-fullscreen-save span");

  spinner.show();
  api.savecontent();

  hidden.val("wp-fullscreen-save-post");

  $.post(
    ajaxurl,
    $("form#post").serialize(),
    function (r) {
      spinner.hide();
      message.show();

      setTimeout(function () {
        message.fadeOut(1000);
      }, 3000);

      if (r.last_edited)
        $("#wp-fullscreen-save input").attr("title", r.last_edited);
    },
    "json"
  );

  hidden.val(old);
};

api.savecontent = function () {
  var ed, content;

  if (s.title_id) $("#" + s.title_id).val($("#wp-fullscreen-title").val());

  if (s.mode === "tinymce" && (ed = tinyMCE.get("wp_mce_fullscreen"))) {
    content = ed.save();
  } else {
    content = $("#wp_mce_fullscreen").val();
  }

  $("#" + s.editor_id).val(content);
  $(document).triggerHandler("wpcountwords", [content]);
};

set_title_hint = function (title) {
  if (!title.val().length) title.siblings("label").css("visibility", "");
  else title.siblings("label").css("visibility", "hidden");
};

api.dfw_width = function (n) {
  var el = $("#wp-fullscreen-wrap"),
    w = el.width();

  if (!n) {
    // reset to theme width
    el.width($("#wp-fullscreen-central-toolbar").width());
    deleteUserSetting("dfw_width");
    return;
  }

  w = n + w;

  if (w < 200 || w > 1200)
    // sanity check
    return;

  el.width(w);
  setUserSetting("dfw_width", w);
};
