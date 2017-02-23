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

    this.bindEventListeners()
  }

  show() {

    this.formEl.show()
  }

  bindEventListeners() {
    $("#comment-form").on('submit',(evt) => { this.submit(evt) })
  }

  submit(evt) {
    console.log('submitting')
    evt.preventDefault();
    var commentContent = $("#comment-content").val();
    commentContent && $("#comment-form").remove();
    $(".comments-list").append("<li>"+commentContent+ "</li>")
  }
}

const Tedium = function() { 
  this.commentBox = new CommentBox()
}

Tedium.openFormModal = () => {
   $($('.inline-modal-wrapper').html()).clone().insertAfter('.article-content').css('display', 'block')
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
  },

});