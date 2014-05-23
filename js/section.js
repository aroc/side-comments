_ = require('lodash');
var Template = require('../templates/section.html');
var CommentTemplate = require('../templates/comment.html');

/**
 * Creates a new Section object, which is responsible for managing a single comment section.
 * @param {Object} $parentEl The jQuery object that represents the section.
 * @param {Array} comments   The array of comments for this section. Optional.
 */
function Section( $parentEl, comments ) {
	this.$parentEl = $parentEl;
	this.comments = comments ? comments.comments : [];
	this.id = $parentEl.data('section-id');
	this.$parentEl.on('click', '.side-comment .add-comment', _.bind(this.addCommentClickCallback, this));
	this.render();
}

/**
 * Callback for the comment button click event.
 * @param {Object} event The event object.
 */
Section.prototype.addCommentClickCallback = function( event ) {
  event.preventDefault();
  this.toggleCommentForm(true);
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
	this.toggleCommentForm(false);
};

/**
 * Focus on the comment box in the comment form.
 */
Section.prototype.focusCommentBox = function() {
	this.$el.find('.comment-box').get(0).focus();
};

/**
 * Toggle showing or hiding the comment form for this section.
 * @param  {Boolean} show Whether to show or hide the form.
 */
Section.prototype.toggleCommentForm = function( show ) {
  if (this.comments.length > 0) {
    this.$el.find('.add-comment').toggleClass('hide', show);
    this.$el.find('.comment-form').toggleClass('active', show);
  }

  if (show) {
    this.focusCommentBox();
  } else {
    this.$el.find('.comment-box').empty();
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