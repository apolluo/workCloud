$('#button').button();
wc.extend({
  bx: (function() {
    "use strict";

    var elem,
      hideHandler,
      that = {};

    that.init = function(options) {
      elem = $(options.selector);
    };

    that.show = function(text) {
      clearTimeout(hideHandler);

      elem.find("span").html(text);
      elem.delay(200).fadeIn().delay(4000).fadeOut();
    };
    $(function() {
      that.init({
        "selector": ".bb-alert"
      });
    });

    return that;
  }()),
  log: function(msg) {
    if (msg) {
      switch (msg.state) {
        case 'start':
          bootbox.dialog({
            message: '<ul id="wc_log_txt" style="max-height:250px;overflow-y:scroll;"><li>' + msg.txt + '</li></ul>',
            title: "消息提醒",
            className: "wc_log",
            formRb: true,
            backdrop: false
          });
          break;
        case 'loading':
          $('#wc_log_txt').append('<li>' + msg.txt + '</li>')
          break;
        case 'end':
          setTimeout(function() {
            $('.wc_log').modal("hide");
          }, 3000);
          break;
        default:
          bootbox.dialog({
            message: msg,
            title: "消息提醒",
            className: "wc_log",
            formRb: true,
            backdrop: false
          });
          break;

      }
    }

  },
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
        effect: "blind",
        duration: 300
      },
      hide: option.hide || {
        effect: "explode",
        duration: 300
      }
    });
  }
});
