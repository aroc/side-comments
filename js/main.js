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
  this.$sideComments = null;
  
  // Event bindings
  this.$el.on('click', '.side-comment .marker', _.bind(this.toggleComments, this));
  this.$el.on('click', '.add-comment', _.bind(function(){
    this.toggleCommentForm(this.$selectedSideComment, true);
  }, this));
  this.$el.on('click', '.actions .cancel', _.bind(this.cancelComment, this));

  this.insertComments( this.existingComments );
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
  var sectionId = $section.data('section-id').toString();
  var sectionComments = _.find(this.existingComments, { sectionId: sectionId });
  var comments = [];
  if (sectionComments) {
    comments = sectionComments.comments;
  }
  var commentClass = comments.length > 0 ? 'has-comments' : '';
  $(_.template(SideCommentsTemplate, { comments: comments, commentClass: commentClass })).appendTo($section);
};

/**
 * Toggles show/hide of the comments.
 * @param  {Object} event The jQuery event object.
 */
SideComments.prototype.toggleComments = function( event ) {
  event.preventDefault();
  var $nextSideComment = $(event.target).closest('.side-comment');

  if (!this.commentsAreVisible()) {
    
    this.$body.addClass('side-comments-open');
    $nextSideComment.addClass('active');

  } else if (this.commentsAreVisible() && $nextSideComment.hasClass('active')) {

    this.hideComments();

  } else {

    this.$sideComments.removeClass('active');
    $nextSideComment.addClass('active');

  }

  if (!$nextSideComment.hasClass('has-comments')) {
    this.focusCommentBox($nextSideComment);
  } else {
    this.toggleCommentForm($nextSideComment, false);
  }

  this.$selectedSideComment = $nextSideComment;
};

/**
 * Hide the comments.
 */
SideComments.prototype.hideComments = function() {
  this.$body.removeClass('side-comments-open');
  this.$selectedSideComment.removeClass('active');
  this.toggleCommentForm(this.$selectedSideComment, false);
};

/**
 * Toggle showing the comment form for a section.
 * @param  {Boolean} show Whether to show the comment form or hide it.
 */
SideComments.prototype.toggleCommentForm = function( $sideComment, show ) {
  $sideComment.find('.add-comment').toggleClass('hide', show);
  $sideComment.find('.comment-form').toggleClass('active', show);

  if (show) {
    this.focusCommentBox(this.$selectedSideComment);
  } else {
    $sideComment.find('.comment-form').removeClass('active').find('.comment-box').empty();
  }
};

/**
 * Focus on the comment box for the currently selected seide comment.
 */
SideComments.prototype.focusCommentBox = function( $sideComment ) {
  $sideComment.find('.comment-box').get(0).focus();
};

/**
 * Cancel action callback.
 * @param  {Object} event The jQuery event object.
 */
SideComments.prototype.cancelComment = function( event ) {
  event.preventDefault();

  if (this.$selectedSideComment.hasClass('has-comments')) {
    this.toggleCommentForm(this.$selectedSideComment, false);
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

// Temp
var existingComments = [
  {
    "sectionId": "1",
    "comments": [
      {
        "authorAvatarUrl": "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
        "authorName": "Eric Anderson",
        "comment": "Hey there!"
      },
      {
        "authorAvatarUrl": "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
        "authorName": "Jim Beam",
        "comment": "I'm drunk!"
      }
    ]
  },
  {
    "sectionId": "3",
    "comments": [
      {
        "authorAvatarUrl": "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
        "authorName": "Jim Beam",
        "comment": "I'm drunk!"
      }
    ]
  }
];
var sideComments = new SideComments('#commentable-container', existingComments);

module.exports = SideComments;