_ = require('lodash');
var SideCommentsTemplate = require('../templates/side-comment.html');

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
  this.existingComments = existingComments || [];
  this.$body = $('body');
  this.$commentableSections = this.$el.find('.commentable-section');
  this.$sideComments = null;
  this.$el.on('click', '.side-comment .marker', _.bind(this.toggleComments, this));
  this.insertComments( existingComments );
}

/**
 * Adds the comments beside each commentable section.
 */
SideComments.prototype.insertComments = function( existingComments ) {
  _.each(this.$commentableSections, function( section ){
    this.insertComment( section );
  }, this);
  this.$sideComments = this.$el.find('.side-comment');
};

/**
 * Adds a comment
 * @param  {Object} section The dom element for the section to add comments to.
 */
SideComments.prototype.insertComment = function( section ) {
  var $section = $(section);
  $(_.template(SideCommentsTemplate, {})).appendTo($section);
};

/**
 * Toggles show/hide of the comments.
 * @param  {Object} event The jQuery event object.
 */
SideComments.prototype.toggleComments = function( event ) {
  event.preventDefault();
  
  var $selectedSideComment = $(event.target).closest('.side-comment');

  if (!this.commentsAreVisible()) {
    
    this.$body.addClass('side-comments-open');
    $selectedSideComment.addClass('active');

  } else if (this.commentsAreVisible() && $selectedSideComment.hasClass('active')) {

    this.$body.removeClass('side-comments-open');
    $selectedSideComment.removeClass('active');

  } else {

    this.$sideComments.removeClass('active');
    $selectedSideComment.addClass('active');

  }
};

/**
 * Checks if comments are visible or not.
 * @return {Boolean} Whether or not the comments are visible.
 */
SideComments.prototype.commentsAreVisible = function() {
  return this.$body.hasClass('side-comments-open');
};

// Temp
var sideComments = new SideComments('#commentable-container');

module.exports = SideComments;