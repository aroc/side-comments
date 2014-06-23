var _ = require('lodash');
var CommentTemplate = require('../templates/comment.html');

/**
 * Creates a new Comment
 * @param {[type]} section    [description]
 * @param {[type]} attributes [description]
 */
function Comment( section, attributes ){
	this.section = section;
	this.attributes = attributes;
}

Comment.prototype.render = function() {
	
};