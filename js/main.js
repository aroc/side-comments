_ = require('lodash');
var Section = require('./section.js');
var Emitter = require('emitter');
var eventPipe = new Emitter;

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
  this.$body = $('body');
  this.eventPipe = eventPipe;

  this.existingComments = existingComments || [];
  this.sections = [];
  this.activeSection = null;
  
  // Event bindings
  this.eventPipe.on('showComments', _.bind(this.showComments ,this));
  this.eventPipe.on('hideComments', _.bind(this.hideComments ,this));
  this.eventPipe.on('sectionSelected', _.bind(this.sectionSelected ,this));
  this.eventPipe.on('sectionDeselected', _.bind(this.sectionDeselected ,this));
  this.eventPipe.on('commentPosted', _.bind(this.commentPosted ,this));
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

    this.sections.push(new Section(this.eventPipe, $section, sectionComments));
  }, this);
};

/**
 * Shows the side comments.
 */
SideComments.prototype.showComments = function() {
  this.$body.addClass('side-comments-open');
};

/**
 * Hide the comments.
 */
SideComments.prototype.hideComments = function() {
  this.$body.removeClass('side-comments-open');
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
 * @param  {comment} comment  The comment object to be posted.
 */
SideComments.prototype.commentPosted = function( comment ) {
  this.emit('commentPosted', comment);
}

/**
 * Inserts the given comment into the right section.
 * @param  {Object} comment A comment to be inserted.
 */
SideComments.prototype.insertComment = function( comment ) {
  var section = _.find(this.sections, { id: comment.sectionId });
  section.insertComment(comment);
}

/**
 * Checks if comments are visible or not.
 * @return {Boolean} Whether or not the comments are visible.
 */
SideComments.prototype.commentsAreVisible = function() {
  return this.$body.hasClass('side-comments-open');
};

/**
 * Callback for body clicks. We hide the comments if someone clicks outside of the comments section.
 * @param  {Object} event The event object.
 */
SideComments.prototype.bodyClick = function( event ) {
  var $target = $(event.target);
  
  if ($target.closest('.side-comment').length < 1) {
    if (this.activeSection) {
      this.activeSection.deselect();
    }
    this.hideComments();
  }
};

/**
 * Destroys the instance of SideComments, including unbinding from DOM events.
 */
SideComments.prototype.destroy = function() {
  this.hideComments();
  this.$el.off();
};

module.exports = SideComments;
window.SideComments = SideComments;