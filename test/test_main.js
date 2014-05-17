var expect = chai.expect;
 
describe("SideComments", function() {
  describe("constructor", function() {
    it("should have a body", function() {
      var sideComments = new SideComments();
      expect(sideComments.$body).to.equal($('body'));
    });
  });
});