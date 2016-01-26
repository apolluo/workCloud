$('#button').button();
wc.extend({
  alert: function(option) {
    var _dialog = $("#alert");
    //_dialog.text = $('#alert .text')
    if ($.isPlainObject(option)) {
      if (option.id) {
        _dialog = $("#" + option.id);
        //  _dialog.text = $('#' + option.id + ' .text')
      }
      // if (option.text) {
      //   _dialog.text.html(option.text)
      // }

      //_dialog.attr('title', )

      //$("#dialog").dialog("open");
    } else { //string
      //_dialog.attr('title', '友情提示')
      $('#alert >.text').html(option);
      //_dialog.dialog();
    }
    _dialog.dialog({
      autoOpen: true,
      title: option.title || '友情提示',
      width: option.width || 400,
      buttons: option.buttons || [],
      modal: true,
      show: option.show || {
        //effect: "blind",
        duration: 200
      },
      hide: option.hide || {
        //effect: "explode",
        duration: 200
      }
    });
  }
});
