_ = require('lodash');
var Template = require('../templates/section.html');
var CommentTemplate = require('../templates/comment.html');

/**
 * Creates a new Section object, which is responsible for managing a single comment section.
 * @param {Object} $parentEl The jQuery object that represents the section.
 * @param {Array} comments   The array of comments for this section. Optional.
 */
function Section( sideComments, $parentEl, comments ) {
	this.sideComments = sideComments;
	this.$parentEl = $parentEl;
	this.comments = comments ? comments.comments : [];
	this.id = $parentEl.data('section-id');
	this.$parentEl.on('click', '.side-comment .add-comment', _.bind(this.addCommentClick, this));
	this.$parentEl.on('click', '.actions .cancel', _.bind(this.cancelCommentClick, this));
	this.render();
}

/**
 * Callback for the comment button click event.
 * @param {Object} event The event object.
 */
Section.prototype.addCommentClick = function( event ) {
  event.preventDefault();
  this.showCommentForm();
};

/**
 * Show the comment form for this section.
 */
Section.prototype.showCommentForm = function() {
  if (this.comments.length > 0) {
    this.$el.find('.add-comment').addClass('hide');
    this.$el.find('.comment-form').addClass('active');
  }

  this.focusCommentBox();
};

/**
 * Hides the comment form for this section.
 */
Section.prototype.hideCommentForm = function() {
  if (this.comments.length > 0) {
    this.$el.find('.add-comment').removeClass('hide');
    this.$el.find('.comment-form').removeClass('active');
  }

  this.$el.find('.comment-box').empty();
};

/**
 * Focus on the comment box in the comment form.
 */
Section.prototype.focusCommentBox = function() {
	this.$el.find('.comment-box').get(0).focus();
};

/**
 * Cancel callback.
 * @param  {Object} event The event object.
 */
Section.prototype.cancelCommentClick = function( event ) {
  event.preventDefault();
  this.cancelComment();
};

/**
 * Cancel adding of a comment.
 */
Section.prototype.cancelComment = function() {
  if (this.comments.length > 0) {
    this.hideCommentForm();
  } else {
    this.sideComments.hideComments();
  }
};

/**
 * Mark this section as selected.
 */
Section.prototype.select = function() {
	this.$el.addClass('active');

	if (this.comments.length === 0) {
	  this.focusCommentBox();
	}
};

/**
 * Deselect this section.
 */
Section.prototype.deselect = function() {
	this.$el.removeClass('active');
	this.hideCommentForm();
};

/**
 * Get the class to be used on the side comment section wrapper.
 * @return {String} The class names to use.
 */
Section.prototype.commentClass = function() {
	if (this.comments.length > 0) {
		return 'has-comments';
	} else {
		return '';
	}
};

/**
 * Render this section into the DOM.
 */
Section.prototype.render = function() {
	var data = {
	  commentTemplate: CommentTemplate,
	  comments: this.comments,
	  commentClass: this.commentClass()
	};
	this.$el = $(_.template(Template, data)).appendTo(this.$parentEl);
};

/**
 * Desttroy this Section object. Generally meaning unbind events.
 */
Section.prototype.destroy = function() {
	this.$parentEl.off();
}

module.exports = Section;