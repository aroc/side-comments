_ = require('lodash');
var Template = require('../templates/section.html');
var CommentTemplate = require('../templates/comment.html');

/**
 * Creates a new Section object, which is responsible for managing a single comment section.
 * @param {Object} $parentEl The jQuery object that represents the section.
 * @param {Array} comments   The array of comments for this section. Optional.
 */
function Section( $parentEl, $el, comments ) {
	this.$parentEl = $parentEl;
	this.$el = $el;
	this.comments = comments ? comments.comments : [];
	
	this.id = $el.data('section-id');
	
	this.$parentEl.on('deselectSelectedSections', _.bind(this.deselect, this));

	this.$el.on('click', '.side-comment .marker', _.bind(this.markerClick, this));
	this.$el.on('click', '.side-comment .add-comment', _.bind(this.addCommentClick, this));
	this.$el.on('click', '.actions .post', _.bind(this.postCommentClick, this));
	this.$el.on('click', '.actions .cancel', _.bind(this.cancelCommentClick, this));

	this.render();
}

/**
 * Click callback event on markers.
 * @param  {Object} event The event object.
 */
Section.prototype.markerClick = function( event ) {
	event.preventDefault();
	
	if (this.isSelected()) {
		this.deselect();
		this.$parentEl.trigger('sectionDeselected', this);
	} else {
		this.select();
		this.$parentEl.trigger('sectionSelected', this);
	}
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
 * Cancel comment callback.
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
    this.$parentEl.trigger('hideComments');
  }
};

/**
 * Post comment callback.
 * @param  {Object} event The event object.
 */
Section.prototype.postCommentClick = function( event ) {
  event.preventDefault();
  this.postComment();
};

/**
 * Post a comment to this section.
 */
Section.prototype.postComment = function() {
  var commentBody = this.$el.find('.comment-box').html();
  var comment = {
  	sectionId: this.id,
  	authorAvatarUrl: "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
  	authorName: "Eric Anderson",
  	comment: commentBody
  };
  this.$parentEl.trigger('commentPosted', comment);
};

/**
 * Insert a comment into this sections comment list.
 * @param  {Object} comment A comment object.
 */
Section.prototype.insertComment = function( comment ) {
	this.comments.push(comment);
	this.updateCommentCount();
};

/**
 * Increments the comment count for a given section.
 */
Section.prototype.incrementCommentCount = function() {
	this.$el.find('.marker span').text(this.comments.length);
};

/**
 * Mark this section as selected.
 */
Section.prototype.select = function() {
	this.$el.find('.side-comment').addClass('active');

	if (this.comments.length === 0) {
	  this.focusCommentBox();
	}
};

/**
 * Deselect this section.
 */
Section.prototype.deselect = function() {
	this.$el.find('.side-comment').removeClass('active');
	this.hideCommentForm();
};

Section.prototype.isSelected = function() {
	return this.$el.find('.side-comment').hasClass('active');
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
	$(_.template(Template, data)).appendTo(this.$el);
};

/**
 * Desttroy this Section object. Generally meaning unbind events.
 */
Section.prototype.destroy = function() {
	this.$el.off();
}

module.exports = Section;