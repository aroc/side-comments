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
  this.$el.on('click', '.side-comment .marker', _.bind(this.toggleComments, this));
  this.$el.on('click', '.add-comment', _.bind(this.showCommentForm, this));
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
 * Shows the comment form for a given section.
 * @param  {Object} event The jQuery event object.
 */
SideComments.prototype.showCommentForm = function( event ) {
  event.preventDefault();

  var $addLink = $(event.target);
  var $sideComment = $addLink.closest('.side-comment');

  $addLink.hide();
  $sideComment.find('.comment-form').show();
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