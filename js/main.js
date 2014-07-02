var _ = require('./vendor/lodash-custom.js');
var Section = require('./section.js');
var Emitter = require('emitter');

/**
 * Creates a new SideComments instance.
 * @param {Object} el               The selector for the element for
 *                                  which side comments need to be initialized
 * @param {Object} currentUser      An object defining the current user. Used
 *                                  for posting new comments and deciding
 *                                  whether existing ones can be deleted
 *                                  or not.
 * @param {Array} existingComments An array of existing comments, in
 *                                 the proper structure.
 * 
 * TODO: **GIVE EXAMPLE OF STRUCTURE HERE***
 */
function SideComments( el, currentUser, existingComments ) {
  this.$el = $(el);
  this.$body = $('body');
  this.eventPipe = new Emitter;

  this.currentUser = _.clone(currentUser) || null;
  this.existingComments = _.cloneDeep(existingComments) || [];
  this.sections = [];
  this.activeSection = null;
  
  // Event bindings
  this.eventPipe.on('showComments', _.bind(this.showComments, this));
  this.eventPipe.on('hideComments', _.bind(this.hideComments, this));
  this.eventPipe.on('sectionSelected', _.bind(this.sectionSelected, this));
  this.eventPipe.on('sectionDeselected', _.bind(this.sectionDeselected, this));
  this.eventPipe.on('commentPosted', _.bind(this.commentPosted, this));
  this.eventPipe.on('commentDeleted', _.bind(this.commentDeleted, this));
  this.eventPipe.on('addCommentAttempted', _.bind(this.addCommentAttempted, this));
  this.$body.on('click', _.bind(this.bodyClick, this));
  this.initialize(this.existingComments);
}

// Mix in Emitter
Emitter(SideComments.prototype);

/**
 * Adds the comments beside each commentable section.
 */
SideComments.prototype.initialize = function( existingComments ) {
  _.each(this.$el.find('.commentable-section'), function( section ){
    var $section = $(section);
    var sectionId = $section.data('section-id').toString();
    var sectionComments = _.find(this.existingComments, { sectionId: sectionId });

    this.sections.push(new Section(this.eventPipe, $section, this.currentUser, sectionComments));
  }, this);
};

/**
 * Shows the side comments.
 */
SideComments.prototype.showComments = function() {
  this.$el.addClass('side-comments-open');
};

/**
 * Hide the comments.
 */
SideComments.prototype.hideComments = function() {
  if (this.activeSection) {
    this.activeSection.deselect();
    this.activeSection = null;
  }

  this.$el.removeClass('side-comments-open');
};

/**
 * Callback after a section has been selected.
 * @param  {Object} section The Section object to be selected.
 */
SideComments.prototype.sectionSelected = function( section ) {
  this.showComments();

  if (this.activeSection) {
    this.activeSection.deselect();
  }
  
  this.activeSection = section;
};

/**
 * Callback after a section has been deselected.
 * @param  {Object} section The Section object to be selected.
 */
SideComments.prototype.sectionDeselected = function( section ) {
  this.hideComments();
  this.activeSection = null;
};

/**
 * Fired when the commentPosted event is triggered.
 * @param  {Object} comment  The comment object to be posted.
 */
SideComments.prototype.commentPosted = function( comment ) {
  this.emit('commentPosted', comment);
};

/**
 * Fired when the commentDeleted event is triggered.
 * @param  {Object} comment  The commentId of the deleted comment.
 */
SideComments.prototype.commentDeleted = function( comment ) {
  this.emit('commentDeleted', comment);
};

/**
 * Fire an event to to signal that a comment as attempted to be added without
 * a currentUser.
 */
SideComments.prototype.addCommentAttempted = function() {
  this.emit('addCommentAttempted');
};

/**
 * Inserts the given comment into the right section.
 * @param  {Object} comment A comment to be inserted.
 */
SideComments.prototype.insertComment = function( comment ) {
  var section = _.find(this.sections, { id: comment.sectionId });
  section.insertComment(comment);
};

/**
 * Removes the given comment from the right section.
 * @param sectionId The ID of the section where the comment exists.
 * @param commentId The ID of the comment to be removed.
 */
SideComments.prototype.removeComment = function( sectionId, commentId ) {
  var section = _.find(this.sections, { id: sectionId });
  section.removeComment(commentId);
};

/**
 * Delete the comment specified by the given sectionID and commentID.
 * @param sectionId The section the comment belongs to.
 * @param commentId The comment's ID
 */
SideComments.prototype.deleteComment = function( sectionId, commentId ) {
  var section = _.find(this.sections, { id: sectionId });
  section.deleteComment(commentId);
};

/**
 * Checks if comments are visible or not.
 * @return {Boolean} Whether or not the comments are visible.
 */
SideComments.prototype.commentsAreVisible = function() {
  return this.$el.hasClass('side-comments-open');
};

/**
 * Callback for body clicks. We hide the comments if someone clicks outside of the comments section.
 * @param  {Object} event The event object.
 */
SideComments.prototype.bodyClick = function( event ) {
  var $target = $(event.target);
  
  // We do a check on $('body') existing here because if the $target has
  // no parent body then it's because it belongs to a deleted comment and 
  // we should NOT hide the SideComments.
  if ($target.closest('.side-comment').length < 1 && $target.closest('body').length > 0) {
    if (this.activeSection) {
      this.activeSection.deselect();
    }
    this.hideComments();
  }
};

/**
 * Set the currentUser and update the UI as necessary.
 * @param {Object} currentUser The currentUser to be used.
 */
SideComments.prototype.setCurrentUser = function( currentUser ) {
  this.hideComments();
  this.currentUser = currentUser;
  _.each(this.sections, function( section ) {
    section.currentUser = this.currentUser;
    section.render();
  });
};

/**
 * Remove the currentUser and update the UI as necessary.
 */
SideComments.prototype.removeCurrentUser = function() {
  this.hideComments();
  this.currentUser = null;
  _.each(this.sections, function( section ) {
    section.currentUser = null;
    section.render();
  });
};

/**
 * Destroys the instance of SideComments, including unbinding from DOM events.
 */
SideComments.prototype.destroy = function() {
  this.hideComments();
  this.$el.off();
};

module.exports = SideComments;
