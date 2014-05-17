_ = require('lodash');
var SideCommentsTemplate = require('../templates/section.html');

function Section( $parentEl, comments ) {
	this.$parentEl = $parentEl;
	this.comments = comments ? comments : [];
	this.id = $parentEl.data('section-id');
	this.render();
}

Section.prototype.className = function() {
	return this.comments.length > 0 ? 'has-comments' : '';
};

Section.prototype.render = function() {
	var data = {
	  commentTemplate: CommentTemplate,
	  comments: this.comments,
	  commentClass: this.className
	};
	ths.$el = $(_.template(SideCommentsTemplate, data)).appendTo(this.$parentEl);
};

module.exports = Section;