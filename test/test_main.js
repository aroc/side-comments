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
        "authorAvatarUrl": "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
        "authorName": "John Doe",
        "comment": "This is a fantastic comment I posted from the side."
      },
      {
        "id": 100,
        "authorAvatarUrl": "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
        "authorName": "Chris Carter",
        "comment": "I love comments."
      }
    ]
  },
  {
    "sectionId": "3",
    "comments": [
      {
        "id": 34,
        "authorAvatarUrl": "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
        "authorName": "Jim Beam",
        "comment": "I'm drunk!"
      }
    ]
  }
];

/***********/
/* Helpers *
/***********/

var $section1;
var $section2;
var $section3;
var newTestComment = {
  id: 278,
  authorAvatarUrl: "https://d262ilb51hltx0.cloudfront.net/fit/c/64/64/0*bBRLkZqOcffcRwKl.jpeg",
  authorName: "Charles Brown",
  comment: "This is a test comment."
};

function testCommentForSection( sectionNumber ) {
  var comment = _.clone(newTestComment);
  comment.sectionId = sectionNumber;
  return comment;
}

function setupSideComments() {
	if (sideComments) {
		sideComments.destroy();
		sideComments = null;
	}
	$('#fixtures').html(fixturesHTML);
	sideComments = new SideComments('#commentable-container', existingComments);
}

function postComment( $section ) {
  $section.find('.marker').trigger('click');
  $section.find('.comment-box').html(newTestComment.comment);
  $section.find('.actions .post').trigger('click');
}
 
describe("SideComments", function() {

	beforeEach(function( done ) {
		setupSideComments();
		done();
	});

	after(function( done ) {
		sideComments.destroy();
		sideComments = null;
		$('#fixtures').html(fixturesHTML);
		done();
	});
  
  describe("Constructor", function() {
    
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

  	it("should have the comment sections hidden at start", function() {
  		expect(sideComments.commentsAreVisible()).to.be.false;
  	});

  	it("should know if the comment sections are hidden or not", function() {
  		$('body').addClass('side-comments-open');
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
			$section1 = $('.side-comment').eq(0);
			$section2 = $('.side-comment').eq(1);
			$section3 = $('.side-comment').eq(2);
			done();
		});

    it("should render comment markup correctly", function(){
      expect($section1.find('.comments li').first().find('.author-name').text().trim()).to.equal('John Doe');
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

  describe("Comment management", function(){

    beforeEach(function( done ) {
      $section1 = $('.side-comment').eq(0);
      $section2 = $('.side-comment').eq(1);
      $section3 = $('.side-comment').eq(2);
      done();
    });
    
    it("should emit an event when a comment is posted", function(){
      this.timeout(5000);
      var eventFired = false;
      
      postComment($section2);

      setTimeout(function () {
        expect(eventFired).to.be.true;
        done();
      }, 1000);

      sideComments.on('commentPosted', function( comment ) {
        eventFired = true;
      });
    });

    // it("should update an empty section's comment array after adding", function(){
    //   sideComments.insertComment(testCommentForSection(1));
    //   expect($section2.find('.comments')).to.have.length.of(3);
    // });

    // it("should update a non-empty section's comment array after adding", function(){
    //   sideComments.insertComment(testCommentForSection(2));
    //   expect($section2.$el.find('.comments')).to.have.length.of(1);
    // });

  });

});