var expect = chai.expect;
var SideComments = require('side-comments');
var sideComments;
var fixturesHTML = $('#fixtures').html();

var existingComments = [
  {
    "sectionId": "1",
    "comments": [
      {
        "id": 88,
        "authorAvatarUrl": "http://f.cl.ly/items/1W303Y360b260u3v1P0T/jon_snow_small.png",
        "authorName": "Jon Sno",
        "authorId": 1,
        "comment": "I'm Ned Stark's bastard. Related: I know nothing."
      },
      {
        "id": 112,
        "authorAvatarUrl": "http://f.cl.ly/items/2o1a3d2f051L0V0q1p19/donald_draper.png",
        "authorName": "Donald Draper",
        "authorId": 2,
        "comment": "I need a scotch."
      }
    ]
  },
  {
    "sectionId": "3",
    "comments": [
      {
        "id": 66,
        "authorAvatarUrl": "http://f.cl.ly/items/0l1j230k080S0N1P0M3e/clay-davis.png",
        "authorName": "Senator Clay Davis",
        "authorId": 3,
        "comment": "These Side Comments are incredible. Sssshhhiiiiieeeee."
      }
    ]
  }
];
var currentUser = {
  "id": 1,
  "avatarUrl": "http://f.cl.ly/items/1W303Y360b260u3v1P0T/jon_snow_small.png",
  "name": "Jon Sno",
};

/***********/
/* Helpers *
/***********/

var $section1;
var $section2;
var $section3;

var newTestComment = {
  id: 278,
  authorId: 1,
  authorAvatarUrl: "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
  authorName: "New Test Commenter",
  comment: "This is a test comment."
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

function testCommentForSection( sectionNumber ) {
  var comment = _.clone(newTestComment);
  comment.sectionId = sectionNumber;
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
 
describe("SideComments", function() {

	after(function( done ) {
		sideComments.destroy();
		sideComments = null;
		$('#fixtures').html(fixturesHTML);
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

  	it("should toggle the display of the comments when a marker is clicked", function() {
  		$('.side-comment').first().find('.marker').trigger('click');
  		expect(sideComments.commentsAreVisible()).to.be.true;
  	});

  	it("should toggle the display of the comments when a marker is clicked", function() {
  		$('.side-comment').first().find('.marker').trigger('click');
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
      expect($section1.find('.comments li').first().find('.author-name').text().trim()).to.equal('Jon Sno');
    });

		it("should display the right number of comments in the markers for each sections", function(){
			expect($section1.find('.marker span').text()).to.equal('2');
			expect($section2.find('.marker span').text()).to.equal('0');
			expect($section3.find('.marker span').text()).to.equal('1');
		});

		it("should display the right number of comments in the list for each sections", function(){
			expect($section1.find('.comments li')).to.have.length.of(2);
			expect($section2.find('.comments li')).to.have.length.of(0);
			expect($section3.find('.comments li')).to.have.length.of(1);
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

    it("should update a non-empty section's comment list after adding", function(){
      sideComments.insertComment(testCommentForSection(1));
      expect($section1.find('.comments li')).to.have.length.of(3);
    });

    it("should update a non-empty section's comment count after adding", function(){
      sideComments.insertComment(testCommentForSection(1));
      expect($section1.find('.marker span').text().trim()).to.equal("3");
    });

    it("should update an empty section's comment list after adding", function(){
      sideComments.insertComment(testCommentForSection(2));
      expect($section2.find('.comments li')).to.have.length.of(1);
    });

    it("should update an empty section's comment count after adding", function(){
      sideComments.insertComment(testCommentForSection(2));
      expect($section2.find('.marker span').text().trim()).to.equal("1");
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
      sideComments.removeComment(1, 88);
      expect($section1.find('.marker span').text().trim()).to.equal("1");
    });

    it("should update a section's comment list after deleting", function(){
      sideComments.removeComment(1, 88);
      expect($section1.find('.comments li')).to.have.length.of(1);
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