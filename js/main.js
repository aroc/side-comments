_ = require('lodash');

/**
 * Creates a new SideComments instance.
 * @param {[type]} el               The selector for the element for which side comments need
 *                                  to be initialized
 * @param {[type]} existingComments An array of existing comments, in the proper structure:
 *                                  {
 *                                    "[NAME]": [
 *                                      "author":  "[THE COMMENT AUTHOR]",
 *                                      "comment": "[THE COMMENT BODY]"
 *                                    ]
 *                                  }
 */
function SideComments( el, existingComments ) {
  this.$el = $(el);
  this.$commentsContainer = this.$el.append('<div class="side-comments"></div>');
  this.existingComments = existingComments;
  this.initialize();
}

/**
 * Initialize the comments beside each section.
 * @return {[type]} [description]
 */
SideComments.prototype.initialize = function() {
  var self = this;

  this.$el.on('click', '.comment-marker', function(){
    self.toggleComments();
  });

  this.$commentSections = this.$el.find('p');

  _.each(this.$commentSections, function( section ){
    this.addCommentMarker( section );
    // this.addExistingComments( section );
  }, this);
};

SideComments.prototype.toggleComments = function( event ) {
  $('body').toggleClass('side-comments-open');
};

SideComments.prototype.addCommentMarker = function( section ) {
  var $section = $(section);
  var marker = $('<div class="comment-marker"><span class="icon"></span></div>').appendTo($section);
};

var sideComments = new SideComments('#commentable-section');

module.exports = SideComments;