
// -- Helper.js from nodepad https://github.com/alexyoung/nodepad/

exports.dynamicHelpers = {
  flashMessages: function(req, res) {
    if (!req.session) {
      return false;
    }
    var html = '';
    ['error', 'info'].forEach(function(type) {
      var messages = req.flash(type);
      if (messages.length > 0) {
        html += new FlashMessage(type, messages).toHTML();
      }
    });
    return html;
  }
};

function FlashMessage(type, messages) {
  this.type = type;
  this.messages = typeof messages === 'string' ? [messages] : messages;
}

FlashMessage.prototype = {

  icon : function() {
    switch (this.type) {
      case 'info':
        return 'ui-icon-info';
      case 'error':
        return 'ui-icon-alert';
    }
  },

  stateClass : function() {
    switch (this.type) {
      case 'info':
        return 'warning';
      case 'error':
        return 'error';
    }
  },

  toHTML: function() {
    var self = this;
    var html = '<div class="alert-message block-message ' + self.stateClass() + '">'
    html += '<ul class="ui-corner-all">';
    self.messages.forEach(function(msg){
      html += '<li class="ui-icon ' + self.icon() + '"><strong>' + msg + '</strong></li>';
    });
    html += '</ul></div>';

    return html;
  }
};