_ = require('lodash');
var SideCommentsTemplate = require('../templates/side-comment.html');

/**
 * Creates a new SideComments instance.
 * @param {[type]} el               The selector for the element for which side comments need
 *                                  to be initialized
 * @param {[type]} existingComments An array of existing comments, in the proper structure.
 * 
 * TODO: **GIVE EXAMPLE OF STRUCTURE HERE***
 */
function SideComments( el, existingComments ) {
  this.$el = $(el);
  this.existingComments = existingComments || [];
  this.$body = $('body');
  this.$commentableSections = this.$el.find('.commentable-section');
  this.$commentSections = null;
  
  // Event bindings
  this.$el.on('click', '.side-comment .marker', _.bind(this.toggleComments, this));
  this.$el.on('click', '.add-comment', _.bind(function(){
    this.toggleCommentForm(this.$activeCommentSection, true);
  }, this));
  this.$el.on('click', '.actions .cancel', _.bind(this.cancelComment, this));
  this.$body.on('click', _.bind(this.bodyClick, this));

  this.insertComments( this.existingComments );
}

/**
 * Adds the comments beside each commentable section.
 */
SideComments.prototype.insertComments = function( existingComments ) {
  _.each(this.$commentableSections, function( section ){
    this.insertComment( section );
  }, this);
  this.$commentSections = this.$el.find('.side-comment');
};

/**
 * Adds a comment
 * @param  {Object} section The dom element for the section to add comments to.
 */
SideComments.prototype.insertComment = function( section ) {
  var $section = $(section);
  var sectionId = $section.data('section-id').toString();
  var sectionComments = _.find(this.existingComments, { sectionId: sectionId });
  var comments = sectionComments ? sectionComments.comments : [];
  var commentClass = comments.length > 0 ? 'has-comments' : '';
  var data = {
    comments: comments,
    commentClass: commentClass
  };
  $(_.template(SideCommentsTemplate, data)).appendTo($section);
};

/**
 * Toggles show/hide of the comments.
 * @param  {Object} event The jQuery event object.
 */
SideComments.prototype.toggleComments = function( event ) {
  event.preventDefault();
  var $commentSection = $(event.target).closest('.side-comment');

  if (!this.commentsAreVisible()) {
    
    this.$body.addClass('side-comments-open');
    this.selectCommentSection($commentSection);

  } else if (this.commentsAreVisible() && $commentSection.hasClass('active')) {

    this.hideComments();

  } else {

    this.deselectCommentSection(this.$activeCommentSection);
    this.selectCommentSection($commentSection);

  }
};

/**
 * Selects the given $section making it the currently active comment section.
 * @param  {Object} $section The jQuery element representing the comment section to be selected.
 */
SideComments.prototype.selectCommentSection = function( $commentSection ) {
  this.$activeCommentSection = $commentSection;
  this.$activeCommentSection.addClass('active');

  if (!$commentSection.hasClass('has-comments')) {
    this.focusCommentBox(this.$activeCommentSection);
  }
};

/**
 * Deselect the given comment section.
 * @param  {Object} $commentSection The jQuery element for the comment section to be deselected.
 */
SideComments.prototype.deselectCommentSection = function( $commentSection ) {
  $commentSection.removeClass('active');
  this.toggleCommentForm($commentSection, false);
  this.$activeCommentSection = null;
};

/**
 * Hide the comments.
 */
SideComments.prototype.hideComments = function() {
  this.$body.removeClass('side-comments-open');
  this.deselectCommentSection(this.$activeCommentSection);
};

/**
 * Toggle showing the comment form for a section.
 * @param  {Boolean} show Whether to show the comment form or hide it.
 */
SideComments.prototype.toggleCommentForm = function( $commentSection, show ) {
  if ($commentSection.hasClass('has-comments')) {
    $commentSection.find('.add-comment').toggleClass('hide', show);
    $commentSection.find('.comment-form').toggleClass('active', show);
  }

  if (show) {
    this.focusCommentBox(this.$activeCommentSection);
  } else {
    $commentSection.find('.comment-box').empty();
  }
};

/**
 * Focus on the comment box for the currently selected seide comment.
 */
SideComments.prototype.focusCommentBox = function( $commentSection ) {
  $commentSection.find('.comment-box').get(0).focus();
};

/**
 * Cancel action callback.
 * @param  {Object} event The jQuery event object.
 */
SideComments.prototype.cancelComment = function( event ) {
  event.preventDefault();

  if (this.$activeCommentSection.hasClass('has-comments')) {
    this.toggleCommentForm(this.$activeCommentSection, false);
  } else {
    this.hideComments();
  }
};

/**
 * Checks if comments are visible or not.
 * @return {Boolean} Whether or not the comments are visible.
 */
SideComments.prototype.commentsAreVisible = function() {
  return this.$body.hasClass('side-comments-open');
};

/**
 * Callback for body clicks. We hide the comments if someone clicks outside of the comments section.
 * @param  {Object} event The event object.
 */
SideComments.prototype.bodyClick = function( event ) {
  var $target = $(event.target);
  
  if ($target.closest('.side-comment').length < 1) {
    this.hideComments();
  }
};

module.exports = SideComments;
window.SideComments = SideComments;