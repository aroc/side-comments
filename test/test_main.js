var expect = chai.expect;
var SideComments = require('side-comments');
var sideComments;
var fixturesHTML = $('#fixtures').html();

/***********/
/* Helpers *
/***********/

var $section1;
var $section2;
var $section3;

var newTestComment = {
  id: 278,
  authorId: 1,
  authorAvatarUrl: "support/images/user/png",
  authorName: "New Test Commenter",
  comment: "This is a test comment.",
  replies: []
};

function check( done, f ) {
  try {
    f();
    done();
  } catch( e ) {
    done( e );
  }
}

function setSections() {
  $section1 = $('.side-comment').eq(0);
  $section2 = $('.side-comment').eq(1);
  $section3 = $('.side-comment').eq(2);
}

function testCommentForSection( sectionNumber, replyFor ) {
  var comment = _.clone(newTestComment);
  comment.sectionId = sectionNumber;
  if ( replyFor )
    comment.parentId = replyFor;
  return comment;
}

function setupSideComments( withCurrentUser ) {
  var currentUserToPass = currentUser;
  
  if (withCurrentUser === undefined || withCurrentUser === true) {
    currentUserToPass = currentUser;
  } else {
    currentUserToPass = null;
  }

	if (sideComments) {
		sideComments.destroy();
		sideComments = null;
	}
	$('#fixtures').html(fixturesHTML);
	sideComments = new SideComments('#commentable-container', currentUserToPass, existingComments);
}

function teardownSideComments() {
  sideComments.destroy();
  sideComments = null;
  $('#fixtures').html(fixturesHTML);
}
 
describe("SideComments", function() {

	after(function( done ) {
		teardownSideComments();
		done();
	});
  
  describe("Constructor", function() {

    beforeEach(function( done ) {
      setupSideComments();
      setSections();
      done();
    });
    
    it("should have a $el", function() {
      expect(sideComments.$el).to.not.be.empty;
    });

    it("should have a $body", function() {
      expect(sideComments.$body).to.not.be.empty;
    });

    it("should create the right number of Section objects", function() {
    	expect(sideComments.sections).to.have.length.of(3);
    });

  });

  describe("High level display and interactions", function() {

    beforeEach(function( done ) {
      setupSideComments();
      setSections();
      done();
    });

  	it("should have the comment sections hidden at start", function() {
  		expect(sideComments.commentsAreVisible()).to.be.false;
  	});

  	it("should know if the comment sections are hidden or not", function() {
  		$('#commentable-container').addClass('side-comments-open');
  		expect(sideComments.commentsAreVisible()).to.be.true;
  	});

  	it("should make comments visible when a marker is clicked", function() {
  		$('.side-comment').first().find('.marker').trigger('click');
  		expect(sideComments.commentsAreVisible()).to.be.true;
  	});

  	it("should display the comments when a marker is clicked", function() {
  		var $section = $('.side-comment').first();
  		$section.find('.marker').trigger('click');
  		expect($section.hasClass('active')).to.be.true;
  	});

  	it("should hide the previously active section when a different marker is clicked", function() {
  		var $section = $('.side-comment').first();
  		$section.find('.marker').trigger('click');

  		var $nextSection = $('.side-comment').eq(1);
  		$nextSection.find('.marker').trigger('click');

  		expect($section.hasClass('active')).to.be.false;
  	});

  	it("should select the new section when a different marker is clicked", function() {
  		var $section = $('.side-comment').first();
  		$section.find('.marker').trigger('click');

  		var $nextSection = $('.side-comment').eq(1);
  		$nextSection.find('.marker').trigger('click');

  		expect($nextSection.hasClass('active')).to.be.true;
  	});

  	it("should hide the comments when the active section is clicked", function() {
  		var $section = $('.side-comment').first();
  		$section.find('.marker').trigger('click');
  		$section.find('.marker').trigger('click');

  		expect($section.hasClass('active')).to.be.false;
  		expect(sideComments.commentsAreVisible()).to.be.false;
  	});

    it("should hide the comments when the body is clicked", function(){
      $('.side-comment').first().find('.marker').trigger('click');
      $('body p').first().trigger('click');
      expect($('.side-comment').hasClass('active')).to.be.false;
      expect(sideComments.commentsAreVisible()).to.be.false;
    });

  });

	describe("Comments display and interactions", function() {

    beforeEach(function( done ) {
      setupSideComments();
      setSections();
      done();
    });

    it("should render comment markup correctly", function(){
      expect($section1.find('.comments > li').first().children('.author-name').text().trim()).to.equal('Jon Sno');
    });

		it("should display the right number of comments in the markers for each sections", function(){
			expect($section1.find('.marker span').text()).to.equal('2');
			expect($section2.find('.marker span').text()).to.equal('0');
			expect($section3.find('.marker span').text()).to.equal('1');
		});

		it("should display the right number of comments in the list for each sections", function(){
			expect($section1.find('.comments > li')).to.have.length.of(2);
			expect($section2.find('.comments > li')).to.have.length.of(0);
			expect($section3.find('.comments > li')).to.have.length.of(1);
		});

    it("should show the add button when there is one or more comments", function(){
      $section1.find('.marker').trigger('click');
      expect($section1.find('.add-comment').is(':visible')).to.be.true;
    });

    it("should show the comment form when there is not any comments", function(){
      $section2.find('.marker').trigger('click');
      expect($section2.find('.comment-form').is(':visible')).to.be.true;
    });

    it("should hide the add button after it's clicked", function(){
      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
      expect($section1.find('.add-comment').is(':visible')).to.be.false;
    });

    it("should hide the comment form when the cancel button is clicked for a section with comments", function(){
      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
      $section1.find('.actions .cancel').trigger('click');
      expect($section1.find('.actions').is(':visible')).to.be.false;
    });

    it("should show the add comment button again when the cancel button is clicked for a section with comments", function(){
      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
      $section1.find('.actions .cancel').trigger('click');
      expect($section1.find('.add-comment').is(':visible')).to.be.true;
    });

    it("should hide the section the cancel button is clicked for a section without comments", function(){
      $section2.find('.marker').trigger('click');
      $section2.find('.actions .cancel').trigger('click');
      expect($section2.find('.comments').is(':visible')).to.be.false;
    });

    it("should hide the side comments when the cancel button is clicked for a section without comments", function(){
      $section2.find('.marker').trigger('click');
      $section2.find('.actions .cancel').trigger('click');
      expect(sideComments.commentsAreVisible()).to.be.false;
    });

    it("should assign the reply form to the correct comment", function () {
      expect($section1.find('.comments > li').first().find('.reply-form').data('parent')).to.equal($section1.find('.comments > li').first().data('comment-id'));
    });

    it("should hide the previous reply form when clicking to reply another comment", function () {
      $section1.find('.marker').trigger('click');
      $section1.find('.comments > li').first().find('.reply-comment').trigger('click');
      var $form1 = $section1.find('.reply-form.active');

      $section1.find('.comments > li').last().find('.reply-comment').trigger('click');

      expect($form1.is(":visible")).to.be.false;
    });

    it("should hide the add comments form when clicking to reply a comment", function () {
      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');

      $section1.find('.comments > li').first().find('.reply-comment').trigger('click');
      expect($section1.find('.comment-form').is(':visible')).to.be.false
    });

    it("should display the reply form when the reply button is clicked in a comment", function () {
      $section1.find('.marker').trigger('click');
      $section1.find('.comments > li').first().find('.reply-comment').trigger('click');
      expect($section1.find('.comments > li').first().find('.reply-form').is(':visible')).to.be.true;
    });

    it("should not have a link for comments that do not have a authorUrl", function(){
      $section1.find('.marker').trigger('click');
      var $authorName = $section1.find('.author-name').eq(2);
      expect($authorName.prop('tagName').toLowerCase()).to.eq('p');
    });

    it("should have a link for comments that have a authorUrl", function(){
      $section1.find('.marker').trigger('click');
      var $authorName = $section1.find('.author-name').eq(0);
      expect($authorName.prop('tagName').toLowerCase()).to.eq('a');
    });

	});

  describe("New Comment Posting", function(){

    beforeEach(function( done ) {
      setupSideComments();
      setSections();
      done();
    });
    
    it("should emit an event when a comment is posted", function( done ){
      this.timeout(0);
      var eventFired = false;

      setTimeout( function () {
        check( done, function() {
          expect(eventFired).to.be.true;
        } )
      }, 500);

      sideComments.on('commentPosted', function( comment ) {
        eventFired = true;
      });

      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
      $section1.find('.comment-box').html(newTestComment.comment);
      $section1.find('.action-link.post').trigger('click');
    });

    it("should update a non-empty section's comment list length after adding", function(){
      sideComments.insertComment(testCommentForSection(1));
      expect($section1.find('.comments > li')).to.have.length.of(3);
    });

    it("should update a non-empty section's comment count after adding", function(){
      sideComments.insertComment(testCommentForSection(1));
      expect($section1.find('.marker span').text().trim()).to.equal("3");
    });

    it("should update an empty section's comment list length after adding", function(){
      sideComments.insertComment(testCommentForSection(2));
      expect($section2.find('.comments > li')).to.have.length.of(1);
    });

    it("should update an empty section's comment count after adding", function(){
      sideComments.insertComment(testCommentForSection(2));
      expect($section2.find('.marker span').text().trim()).to.equal("1");
    });

    it("should have a link for comments posted by a currentUser that has a authorUrl", function(){
      sideComments.on('commentPosted', function( comment ) {
        comment.id = 99;
        sideComments.insertComment(comment);
      });

      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
      $section1.find('.comment-box').val('Test Comment');
      $section1.find('.action-link.post').trigger('click');
      var $lastCommentAuthor = $section1.find('.comments > li').last().find('.author-name');

      expect($lastCommentAuthor.attr('href')).to.eq(currentUser.authorUrl);
    });

    it("should be inserted with a comment body", function () {
      sideComments.on('commentPosted', function ( comment ) {
        comment.id = 123;
        sideComments.insertComment(comment);
      });

      var commentBody = 'Test comment';

      $section2.find('.marker').trigger('click');
      $section2.find('.add-comment').trigger('.click');
      $section2.find('.comment-box').val(commentBody);
      $section2.find('.action-link.post').trigger('click');

      expect($section2.find('.comments > li').last().find('.comment').text().trim()).to.equal(commentBody)
    });

    describe("Comment is a reply", function () {

      it("should emit an event when a reply is posted", function ( done ) {
        this.timeout(0);
        var eventFired = false;

        setTimeout( function () {
          check( done, function() {
            expect(eventFired).to.be.true;
          } )
        }, 500);

        sideComments.on('commentPosted', function( comment ) {
          eventFired = true;
        });

        $section1.find('.marker').trigger('click');
        $section1.find('.comments > li').first().find('.reply-comment').trigger('click');
        $section1.find('.comments > li').first().find('.comment-box').html(newTestComment.comment);
        $section1.find('.comments > li').first().find('.reply-form .post').trigger('click');
      });

      it("should update a non-empty reply list length after adding", function(){
        sideComments.insertComment(testCommentForSection(1, 88));
        expect($section1.find('.comments > li').first().find('.replies li')).to.have.length.of(2);
      });

      it("should update an empty reply list length after adding", function () {
        sideComments.insertComment(testCommentForSection(3, 66));
        expect($section3.find('.comments > li').first().find('.replies li')).to.have.length.of(1);
      });

      it("should update an empty reply list of a new comment", function () {
        sideComments.insertComment(testCommentForSection(2));
        sideComments.insertComment(testCommentForSection(2, 278));
        expect($section2.find('.comments > li').first().find('.replies li')).to.have.length.of(1);
      });

      it("should belong to the current user", function () {
        sideComments.on('commentPosted', function( comment ) {
          comment.id = 3335;
          sideComments.insertComment(comment);
        });

        $section1.find('.comments > li').first().find('.reply-comment').trigger('click');
        $section1.find('.comments > li').first().find('.comment-box').html(newTestComment.comment);
        $section1.find('.comments > li').first().find('.reply-form .action-link.post').trigger('click');

        expect($section1.find('.comments > li').first().find('.replies li').last().find('.author-name').text().trim()).to.equal(currentUser.name);
      });

    });

  });


  describe("Comment Deleting", function(){
    
    beforeEach(function( done ) {
      setupSideComments();
      setSections();
      done();
    });

    it("should emit an event when a comment is deleted", function( done ){
      this.timeout(0);
      var eventFired = false;

      setTimeout( function () {
        check( done, function() {
          expect(eventFired).to.be.true;
        } )
      }, 500);

      sideComments.on('commentDeleted', function( comment ) {
        eventFired = true;
      });

      sideComments.sections[0].deleteComment(88);
    });

    it("should update a section's comment count after removing", function(){
      sideComments.removeComment(1, 112);
      expect($section1.find('.marker span').text().trim()).to.equal("1");
    });

    it("should update a section's comment list after deleting", function(){
      sideComments.removeComment(1, 112);
      expect($section1.find('.comments > li')).to.have.length.of(1);
    });

    it("should remove a section's comment count after deleting if it's the last comment", function(){
      sideComments.removeComment(3, 66);
      expect($section3.find('.marker').is(':visible')).to.be.false;
    });

    it("should show a section's comment form after deleting if it's the last comment", function(){
      sideComments.removeComment(3, 66);
      $section3.find('.marker').trigger('click');
      expect($section3.find('.comment-form').is(':visible')).to.be.true;
    });

    it("should only update a comment's body when the deleted comment has replies", function () {
      sideComments.removeComment(1, 88);
      var comment = $section1.find('.comments > li').first().find('.comment').first().text();
      expect(comment).to.equal("Comment deleted by the author");
    });

    describe("Comment is a reply", function () {

      it("should emit an event when a comment is deleted", function( done ){
        this.timeout(0);
        var eventFired = false;

        setTimeout( function () {
          check( done, function() {
            expect(eventFired).to.be.true;
          } )
        }, 500);

        sideComments.on('commentDeleted', function( comment ) {
          eventFired = true;
        });

        sideComments.sections[0].deleteComment(100, 88);
      });

      it("should update a comment replies list after deleting", function () {
        sideComments.removeComment(1, 100, 88);
        expect($section1.find('.comments > li').first().find('.replies li')).to.have.length.of(0)
      });

    });

  });

  describe("No Current User", function(){

    beforeEach(function( done ) {
      setupSideComments( false );
      setSections();
      done();
    });

    it("should show the add comment button rather than the comment form on sections without comments", function(){
      $section2.find('.marker').trigger('click');
      expect($section2.find('.add-comment').is(':visible')).to.be.true;
      expect($section2.find('.comment-form').is(':visible')).to.be.false;
    });

    it("should add the no-curent-user class to all sections", function(){
      expect($('.side-comment.no-current-user')).to.have.length.of(3);
    });

    it("should emit the 'addCommentAttempted' event when a user tries to add a comment", function( done ){
      this.timeout(0);
      var eventFired = false;

      setTimeout( function () {
        check( done, function() {
          expect(eventFired).to.be.true;
        } )
      }, 500);

      sideComments.on('addCommentAttempted', function( comment ) {
        eventFired = true;
      });
      
      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
    });

  });

  describe("Setting a Current User", function(){

    beforeEach(function( done ) {
      setupSideComments( false );
      setSections();
      done();
    });

    it("should update the UI once a currentUser has been set", function(){
      sideComments.setCurrentUser(currentUser);
      setSections();

      $section2.find('.marker').trigger('click');
      expect($section2.find('.add-comment').is(':visible')).to.be.false;
      expect($section2.find(".comment-form").is(':visible')).to.be.true;

      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
      expect($section1.find(".comment-form").is(':visible')).to.be.true;
    });

  });

  describe("Removing a Current User", function(){

    beforeEach(function( done ) {
      setupSideComments();
      $section1 = $('.side-comment').eq(0);
      $section2 = $('.side-comment').eq(1);
      $section3 = $('.side-comment').eq(2);
      done();
    });

    it("should update the UI once a currentUser has been removed", function(){
      sideComments.removeCurrentUser();
      setSections();

      $section2.find('.marker').trigger('click');
      expect($section2.find('.add-comment').is(':visible')).to.be.true;
      expect($section2.find(".comment-form").is(':visible')).to.be.false;

      $section1.find('.marker').trigger('click');
      $section1.find('.add-comment').trigger('click');
      expect($section1.find(".comment-form").is(':visible')).to.be.false;
    });

  });

});