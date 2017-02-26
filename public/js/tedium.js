class CommentList {

}


class CommentBox {
  constructor(props) {
    this.form = props.form
    this.commentList = new CommentList()
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

    var $jQueryObject = $($.parseHTML(template))
    this.formEl = $jQueryObject
    this.timeStamp = +(new Date) // Timestamp unique for the modal
    this.formEl.attr("id", this.timeStamp)
    this.formEl.insertAfter(".article-content");
    this.getClientRect();
    this.bindEventListeners();
  }


  show() {
    this.formEl.show()
    this.clientRect = this.getClientRect();
  }

  getClientRect() {
    var s = window.getSelection(),
    oRange = s.getRangeAt(0), //get the text range
    oRect = oRange.getBoundingClientRect();

    // Consider page scroll while determining position of the selected text
    return {
      top : oRect.top + document.body.scrollTop
    };
  }

  bindEventListeners() {
    this.formEl.on('submit',(evt) => { this.submit(evt) })
  }

  submit(evt) {
    console.log('submitting')
    evt.preventDefault();
    var commentContent = this.formEl.find("#comment-content").val();
    commentContent && this.formEl.find("#comment-form").remove();

    var id = 'comment-' + commentContent + '-' + this.timeStamp;

    // Create new Comment component
    var newComment = $("<div>", {
      id : id,
    }).html('<i class="fa fa-star" aria-hidden="true"></i> You responded here');

    $(".all-comments").append(newComment);
    newComment.css('position', 'absolute');

    // offset() function calls reflow of the DOM. Wait before the actual DOM reflow
    setTimeout(function(ctxt) {
        newComment.offset({
        top : ctxt.clientRect.top
      });
    },10,this);
  }
}

const Tedium = function() { 
  this.commentBox = new CommentBox()
}

Tedium.openFormModal = () => {
   
   var commentFormInstance = new CommentForm($('.inline-modal-wrapper').html());
   commentFormInstance.show();

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
              console.log(html , ' ' , mark , ' ' )
                Tedium.openFormModal();
                return html;
              }
    })
  }

});