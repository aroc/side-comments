_ = require('lodash');
var Template = require('../templates/section.html');
var CommentTemplate = require('../templates/comment.html');

function Section( $parentEl, comments ) {
	this.$parentEl = $parentEl;
	this.comments = comments ? comments.comments : [];
	this.id = $parentEl.data('section-id');
	this.$parentEl.on('click', '.side-comment .add-comment', _.bind(this.addCommentClickCallback, this));
	this.render();
}

Section.prototype.addCommentClickCallback = function( event ) {
  event.preventDefault();
  this.toggleCommentForm(true);
};

Section.prototype.commentClass = function() {
	if (this.comments.length > 0) {
		return 'has-comments';
	} else {
		return '';
	}
};

Section.prototype.select = function() {
	this.$el.addClass('active');

	if (this.comments.length === 0) {
	  this.focusCommentBox();
	}
};

Section.prototype.deselect = function() {
	this.$el.removeClass('active');
	this.toggleCommentForm(false);
};

Section.prototype.focusCommentBox = function() {
	this.$el.find('.comment-box').get(0).focus();
};

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

Section.prototype.render = function() {
	var data = {
	  commentTemplate: CommentTemplate,
	  comments: this.comments,
	  commentClass: this.commentClass()
	};
	this.$el = $(_.template(Template, data)).appendTo(this.$parentEl);
};

Section.prototype.destroy = function() {
	this.$parentEl.off();
}

module.exports = Section;