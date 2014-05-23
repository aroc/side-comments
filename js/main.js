_ = require('lodash');
var Section = require('./section.js');
var CommentTemplate = require('../templates/comment.html');

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

  this.existingComments = existingComments || [];
  this.sections = [];
  
  // Event bindings
  this.$el.on('hideComments', _.bind(this.hideComments ,this));
  this.$el.on('click', '.side-comment .marker', _.bind(this.markerClick, this));
  this.$body.on('click', _.bind(this.bodyClick, this));

  this.initialize(this.existingComments);
}

/**
 * Adds the comments beside each commentable section.
 */
SideComments.prototype.initialize = function( existingComments ) {
  _.each(this.$el.find('.commentable-section'), function( section ){
    var $section = $(section);
    var sectionId = $section.data('section-id').toString();
    var sectionComments = _.find(this.existingComments, { sectionId: sectionId });

    this.sections.push(new Section(this.$el, $section, sectionComments));
  }, this);
};

/**
 * Callback on click of section markers.
 * @param  {Object} event The event object.
 */
SideComments.prototype.markerClick = function( event ) {
  event.preventDefault();
  var $marker = $(event.target);
  var sectionId = $marker.closest('.commentable-section').data('section-id');
  this.toggleComments(sectionId);
};

/**
 * Toggles show/hide of the comments.
 * @param  {String} sectionId The ID of the section to toggle comments for.
 */
SideComments.prototype.toggleComments = function( sectionId ) {
  if (!this.commentsAreVisible()) {
    
    this.$body.addClass('side-comments-open');
    this.selectSection(sectionId);

  } else if (this.commentsAreVisible() && (this.activeSection.id === sectionId)) {

    this.hideComments();

  } else {

    this.selectSection(sectionId);

  }
};

/**
 * Selects the given section making it the currently active comment section.
 * @param  {String} sectionId The ID of the section to be selected.
 */
SideComments.prototype.selectSection = function( sectionId ) {
  if (this.activeSection) {
    this.deselectSection(this.activeSection.id);
  }

  var section = _.find(this.sections, { id: sectionId });
  section.select();
  this.activeSection = section;
};

/**
 * Deselect the given comment section.
 * @param  {Object} $commentSection The jQuery element for the comment section to be deselected.
 */
SideComments.prototype.deselectSection = function( sectionId ) {
  var section = _.find(this.sections, { id: sectionId });
  section.deselect();
  this.activeSection = null;
};

/**
 * Hide the comments.
 */
SideComments.prototype.hideComments = function() {
  this.$body.removeClass('side-comments-open');
  if (this.activeSection) {
    this.deselectSection(this.activeSection.id);
  }
};

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