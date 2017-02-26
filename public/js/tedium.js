class CommentList {

  constructor(props) {
    this.list = [];
  }

  add(comment) {
    this.list.push(comment);
  }

  getAllComments() {
    return this.list;
  }

}


var commentBoxInstance;

class CommentBox {
  constructor(props) {
    this.commentList = new CommentList()
    setTimeout(this.bindEventListeners,100);
  }

  bindEventListeners(){
    $(".responses").focusout(() => {
      $(this).css('display','none');
    });
  }

  saveComment(comment){
    this.commentList.add(comment);
  }

  showAllComments() {
    var allComments = this.commentList.getAllComments();

    // Empty respnose
    $(".response-list").html('');

    var commentElements = allComments.map((response) => {
      return this.renderComment(response);
    });

    // List of comments
    $(".response-list").html(commentElements);
    $(".responses").css('display','block').focus();
  }

  hideAllComments(){
    $(".responses").css('display','none');
  }

  renderComment(comment) {
    var response = $(".response").clone();

    response.css('display', 'block');
    response.find('.response-time').text(new Date(comment.time));
    response.find('.response-text').text(comment.text);

    return $("<div>",{
      id: comment.text + '-' + comment.time
    }).html(response);
  }
}

class CommentModal {
  constructor(modalHtml) {
    console.log(modalHtml)
    var $modalEl = $(modalHtml).clone().show()
    $modalEl.insertAfter('.article-content')
  }
}

class CommentForm {
  constructor(template) {

    this.renderElement(template);
    this.bindEventListeners();
  }

  renderElement(template) {
    var $jQueryObject = $($.parseHTML(template))
    this.formEl = $jQueryObject
    this.timeStamp = +(new Date) // Timestamp unique for the modal
    this.formEl.attr("id", this.timeStamp);
    this.formEl.insertAfter(".article-content");
  }

  show() {
    this.formEl.show()
    this.getClientRect();
    
    //Set position of the modal
    

    var $elementModal = $(this.formEl[3]);
    $elementModal.css('position','absolute');

    setTimeout(function(ctxt) {
      $elementModal.offset({
        top : ctxt.clientRect.top - $elementModal.height(),
        left : ctxt.clientRect.left
      });
    },10,this);
  }

  getClientRect() {
    var s = window.getSelection() ,
    oRange = s.getRangeAt(0), //get the text range
    oRect = oRange.getBoundingClientRect();

    // Consider page scroll while determining position of the selected text
    this.clientRect = {
      top : oRect.top + document.body.scrollTop
    };
  }

  bindEventListeners() {
    this.formEl.on('submit',(evt) => { this.submit(evt) })
    this.formEl.find('.cancel-save').on('click',(evt) => {
      this.destroy();
    });
  }

  destroy() {
    this.formEl.remove();
  }

  submit(evt) {
    //Prevent event
    evt.preventDefault();

    var commentContent = this.formEl.find("#comment-content").val();
    
    // If comment is not there, don't do anything
    if(commentContent.trim() === ''){
      return;
    }

    commentContent && this.formEl.find("#comment-form").remove();

    var id = 'comment-' + commentContent + '-' + this.timeStamp;

    // Create new Comment component
    var newComment = $("<div>", {
      id : id,
    }).html('<i class="fa fa-star" aria-hidden="true"></i> You responded here');

    $(".all-comments").append(newComment);
    newComment.css('position', 'absolute').on('click',commentBoxInstance.showAllComments.bind(commentBoxInstance));

    // offset() function calls reflow of the DOM. Wait before the actual DOM reflow
    setTimeout(function(ctxt) {
        newComment.offset({
        top : ctxt.clientRect.top
      });
    },10,this);

    commentBoxInstance.saveComment({
      text : commentContent,
      time : this.timeStamp
    });

    // Destroy after adding comment
    this.destroy();
  }
}

const Tedium = function() { 
  commentBoxInstance = new CommentBox()
}

new Tedium();

Tedium.openFormModal = () => {
   var commentFormInstance = new CommentForm($('.inline-modal-wrapper').html());
   this.liveCommentModalInstance = commentFormInstance.show();
}

Tedium.prototype.editor =  new MediumEditor('.article-container', {
  disableEditing: true,
  toolbar: {
    buttons: ['anchor', 'h2', 'h3', 'highlight', 'comment']
  },
  extensions: {
    'highlight': new MediumButton({
      label: '<i class="fa fa-pencil" aria-hidden="true"></i>',
      start: '<span class="warning">',
      end:   '</span>'
    }),

    'comment': new MediumButton({
      label:'<i class="fa fa-commenting" aria-hidden="true"></i>',
      action: (html, mark, parent) => {
                Tedium.openFormModal();
                return html;
              }
    })
  }

});

$(".article-container").on("click",(evt) => {
  // On clicking on the article container,  remove the comment section
  commentBoxInstance.hideAllComments();
});
