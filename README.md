# SideComments.js
Version 0.0.1

SideComments.js is a UI component to give you [Medium.com](http://medium.com/) style comment management on the front-end. It allows users to comment directly on sections of content rather than the boring comment stream on the bottom of the page that we're so used to. Note that this component only handles the display / user interface of how your comments are presented. It does not provide any utilities to help manage storing or retreiving your comment data from your server, how you do that is entirely up to you.

## Demo

Check out a demo of SideComments here: [https://aroc.github.io/side-comments-demo](https://aroc.github.io/side-comments-demo)

## Get Started
**How to start using SideComments.js on your website immediately.**

### 1. Download SideComments.js

Download SideComments immediately:
[](https://github.com/aroc/side-comments/archive/master.zip)

Install with [Component](https://github.com/component/component):
`component install aroc/side-comments`

or include side-comments in your `component.json` file's `dependencies: {}` object.

### 2. Include SideComments.js in your project.

**Note: jQuery is required**
You must include jQuery in your project in order for SideComments.js to work. This component uses jQuery to manage DOM manipulation and will not work without it.

You'll need to include the following single JavaScript file and two CSS files to get SideComments.js working.
- `release/side-comments.js`
- `release/side-comments.css`
- `release/themes/default-theme.css`

You can choose **not** to include `default-theme.css`, but you'll need to style SideComments youself if you choose not to include it, as `side-comments.css` handles only the basic layout styling and not making it all pretty and looking like Medium.com.

### 3. Set up your HTML.

You need to have a wrapper element to point SideComments at and two things on each commentable section; the class `commentable-section` and the data attribute `data-section-id`, which holds the unique ID of that commentable-section for this page.

```
<div id="commentable-area">
  <p data-section-id="1" class="commentable-section">
    This is a section that can be commented on.
  </p>
  <p data-section-id="2" class="commentable-section">
    This is a another section that can be commented on.
  </p>
  <p data-section-id="3" class="commentable-section">
    This is yet another section that can be commented on.
  </p>
</div>
```

### 4. Initialize a new SideComments object.

```
// First require it.
var SideComments = require('side-comments');

// Then, create a new SideComments instance, passing in the wrapper element and the optional the current user and any existing comments.
sideComments = new SideComments('#commentable-area', currentUser, existingComments);
```

The current user is an object and is expected to be in the following format:

```
{
  id: 1,
  avatarUrl: "http://f.cl.ly/items/0s1a0q1y2Z2k2I193k1y/default-user.png",
  name: "You"
}
```

The existing comments argument is expected to be an array of sections with a nested array of comments. It needs to look like the following:

```
[
  {
    "sectionId": "1",
    "comments": [
      {
        "authorAvatarUrl": "http://f.cl.ly/items/1W303Y360b260u3v1P0T/jon_snow_small.png",
        "authorName": "Jon Sno",
        "comment": "I'm Ned Stark's bastard. Related: I know nothing."
      },
      {
        "authorAvatarUrl": "http://f.cl.ly/items/2o1a3d2f051L0V0q1p19/donald_draper.png",
        "authorName": "Donald Draper",
        "comment": "I need a scotch."
      }
    ]
  },
  {
    "sectionId": "3",
    "comments": [
      {
        "authorAvatarUrl": "http://f.cl.ly/items/0l1j230k080S0N1P0M3e/clay-davis.png",
        "authorName": "Senator Clay Davis",
        "comment": "These Side Comments are incredible. Sssshhhiiiiieeeee."
      }
    ]
  }
];
```

### 5. Listen to post and delete events.

Finally, in order to know when a comment has been posted or deleted, just bind to your SideComments' object events and then do whatever you want with them, (likely save and delete from your database).

```
// Listen to "commentPosted", and send a request to your backend to save the comment.
// More about this event in the "docs" section.
sideComments.on('commentPosted', function( comment ) {
    $.ajax({
        url: '/comments',
        type: 'POST'
        data: comment,
        success: function( savedComment ) {
            // Once the comment is saved, you can insert the comment into the comment stream with "insertComment(comment)".
            sideComments.insertComment(comment);
        }
    });
});

// Listen to "commentDeleted" and send a request to your backend to delete the comment.
// More about this event in the "docs" section.
sideComments.on('commentDeleted', function( commentId ) {
    $.ajax({
        url: '/comments/' + commentId,
        type: 'DELETE',
        success: function( success ) {
            // Do something.
        }
    });
});
```

## Docs
**Overview of all events and method you can leverage in SideComments.js**

### SideComments Constructor
The constructor takes one required and two optional arguments:

- `$el` (String): The element which contains all the `.commentable-section` elements.

- `currentUser` (Object): The user representation new comments will be posted under. As it's optional, you can just pass `null` if there is no current user at the time and set one at a later time with the `setCurrentUser` method, which is documented below. The current user object needs to look like this: [https://gist.github.com/aroc/02a0f8badf219da12667">https://gist.github.com/aroc/02a0f8badf219da12667](https://gist.github.com/aroc/02a0f8badf219da12667">https://gist.github.com/aroc/02a0f8badf219da12667)

- `existingComments` (Array): An array of existing comments that you want inserted at initialization time. You can also insert comments yourself at later time with the `insertComment` method, outlined below. The structure of the objects in this array needs to look like this: [https://gist.github.com/aroc/54a2669783231a0d2215">https://gist.github.com/aroc/54a2669783231a0d2215](https://gist.github.com/aroc/54a2669783231a0d2215">https://gist.github.com/aroc/54a2669783231a0d2215)

### Methods

#### deselectSection(sectionId)
    
De-select a section and make it inactive, hiding the side comments. If the side comments are already hidden, this method will have no effect.

```
sideComments.deselectSection(12);
```

#### setCurrentUser(currentUser)

Sets the currentUser to be used for all new comments.

```
var currentUser = {
  "id": 1,
  "avatarUrl": "users/avatars/user1.png",
  "name": "Jim Jones"
};
sideComments.setCurrentUser(currentUser);
```

#### removeCurrentUser()

Removes the currentUser. Without a currentUser, comments amy not be posted. Instead, the `addCommentAttempted` event gets triggered when a user clicks the "Add Comment" button.

#### insertComment(comment)

Inserts a comment into the markup. It will insert into the section specified by the comment object.

```
var comment = {
  sectionId: 12,
  comment: "Hey there!",
  authorAvatarUrl: "users/avatars/test1.png",
  authorName: "Jim Jones",
  authorId: 16
};
sideComments.insertComment(comment);
```

#### removeComment(sectionId, commentId)

Removes a comment from the SideComments object and from the markup.

#### commentsAreVisible()

Returns true if the comments are visbile, false if they are not.

#### destroy()

Removing the sideComments object, cleaning up any event bindings and removing any markup from the DOM.


### Events

#### commentPosted
Values passed: `comment (Object)`
Fired after a user fills out the comment form and clicks "Post".

#### addCommentAttempted
Values passed: None.
Fired when a sideComments object doesn't have a current user and the "Add Comment" button is clicked.

#### commentDeleted
Values passed: `comment (Object)`
Fired after a user has clicked "Delete" on one of their comments and has confirmed with the dialog that they do want to delete it.


### License

The MIT License (MIT)

Copyright (c) 2014 Eric Anderson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
