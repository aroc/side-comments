_ = require('lodash');
var Template = require('../templates/section.html');
var CommentTemplate = require('../templates/comment.html');

function Section( $parentEl, comments ) {
	this.$parentEl = $parentEl;
	this.comments = comments ? comments : [];
	this.id = $parentEl.data('section-id');
	this.render();
}

Section.prototype.commentClass = function() {
	return this.comments.length > 0 ? 'has-comments' : '';
};

Section.prototype.render = function() {
	var data = {
	  commentTemplate: CommentTemplate,
	  comments: this.comments,
	  commentClass: this.commentClass
	};
	this.$el = $(_.template(Template, data)).appendTo(this.$parentEl);
};

module.exports = Section;