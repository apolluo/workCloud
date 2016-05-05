$('#button').button();
//$("#ngview").niceScroll({cursorcolor:"#00F"});
wc.extend({
  scroll: function(selector) {
    selector=(selector.indexOf('#')==0)?selector:'#'+selector
    $(selector).niceScroll({
      cursorcolor: "#ccc",
      cursorwidth: "10px",
      cursorminheight: 32
    })
  },
  showDir: function(data, id) {
    console.log("showDir")
    console.log(data)
    var _list = id || '#currentProj'
      //刷新
    if ($(_list).children().length > 0) {
      $(_list).jstree(true).settings.core.data = data
      $(_list).jstree(true).refresh();
    } else { //初始化
      //console.log($(_list).jstree)
      $(_list).jstree({
        'core': {
          "check_callback": true,
          'data': [
            data
          ]
        }
      });
    }
    $(_list).css('max-height', parseInt($(_list).parent().css('max-height')) -25);
    wc.scroll(_list)
      // var _data = data;
      // loadProj(data.text)
  },
  // bx: (function() {
  //   "use strict";
  //
  //   var elem,
  //     hideHandler,
  //     that = {};
  //
  //   that.init = function(options) {
  //     elem = $(options.selector);
  //   };
  //
  //   that.show = function(text) {
  //     clearTimeout(hideHandler);
  //
  //     elem.find("span").html(text);
  //     elem.delay(200).fadeIn().delay(4000).fadeOut();
  //   };
  //   $(function() {
  //     that.init({
  //       "selector": ".bb-alert"
  //     });
  //   });
  //
  //   return that;
  // }()),
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
  },
  modal:(function () {
    var templates = {
      dialog: "<div class='modal fade' tabindex='-1' role='dialog'>" +
        "<div class='modal-dialog'>" +
        "<div class='modal-content'>" +
        "<div class='modal-body'><div class='bootbox-body'></div></div>" +
        "</div>" +
        "</div>" +
        "</div>",
      header: "<div class='modal-header'>" +
        "<h4 class='modal-title'></h4>" +
        "</div>",
      footer: "<div class='modal-footer'></div>",
      closeButton: "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",

      success: '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<i class="glyphicon glyphicon-check"></i>' +
        '</div>' +
        '<div class="modal-title"></div>' +
        '<div class="modal-body"></div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>' +
        '</div>' +
        '</div>' +
        ' </div> ' +
        '</div>'

    }
    ,
    queue={},
    state=function () {

    },
    component=function (options) {
      this.options=options;
    }
    component.prototype.__defineSetter__('options',function (options) {
      console.log('hah')
      //单一，不会被销毁
      if(options.id){
        //初始化
        if(!queue[options.id]){
          this.id=options.id;
          this.template=$(templates.dialog);
          this.template.attr('id',options.id);
          var body = this.template.find(".modal-body");
          if (typeof options.message=='string') {
            body.find(".bootbox-body").html(options.message);
          }else{
            body.find(".bootbox-body").append(options.message);
          }

          if (options.title) {
            body.before(templates.header);
            this.template.find('.modal-title').html(options.title);
          }
          var buttons = options.buttons;
          console.log(options.closeButton,'cl')
          if (options.closeButton) {
            var closeButton = $(templates.closeButton);

            if (options.title) {
              this.template.find(".modal-header").prepend(closeButton);
            } else {
              closeButton.css("margin-top", "-10px").prependTo(body);
            }
          }

          $('body').append(this.template)
          queue[options.id]={
            target:this.template,
            isInit:true
          }
        }

          $('#'+options.id).modal('show')

      }else{

      }
    })

    var dialog=function (options) {
      if(!options.hasOwnProperty('closeButton')||options.closeButton!==false){
        options.closeButton=true;
      }
      return new component(options);
    }
    //  dialog.init = function (options) {
    // }

    //dialog.init.prototype=component;
    //dialog.init.prototype=component.prototype;
    return{
      dialog:dialog
       ,
      // loading:loading,
      // success:success,
      // danger:danger,
       hideAll:function () {
         $('.modal').modal('hide')
       }

    }
  }())
});
