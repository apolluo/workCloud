/**
 * [function description]
 * @param  {[type]} msg [
 * log(1,2,3),
 * log(''),
 * log({
 * 	state:'start/loading/run/end/close/stop',
 * 	type:'error/warn/data',
 * 	txt:[]/{}/''
 * })]
 * @return {[type]}     [description]
 */
 var log= function(msg) {
   if (msg) {
     var getMsg=function () {
       if( msg.hasOwnProperty('txt')){
         if ($.isArray(msg.txt)) {
           return msg.txt.join(" ");
         }else if ($.isPlainObject(msg.txt)) {
           return JSON.stringify(msg.txt);
         }else if($.isFunction(msg.txt)) {
           return msg.txt();
         }else {
           return msg.txt;
         }
       }else {
         return arguments.join(" ")
       }
     }
     switch (msg.state) {
       case 'start':
         bootbox.dialog({
           message: '<ul id="wc_log_txt" style="max-height:250px;overflow-y:scroll;"><li>' + getMsg() + '</li></ul>',
           title: "消息提醒",
           className: "wc_log",
           formRb: true,
           backdrop: false
         });
         break;
       case 'loading':
       case 'run':
         $('#wc_log_txt').append('<li>' + getMsg() + '</li>')
         break;
       case 'end':
         setTimeout(function() {
           $('.wc_log').modal("hide");
         }, 3000);
         break;
       default:
         $('#wc_log_txt').append('<li>' + getMsg() + '</li>')
         break;

     }
   }
 }
 module.exports=log;
