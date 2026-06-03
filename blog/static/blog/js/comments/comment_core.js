/* ==================================
      ФОРМА ВВОДА КОММЕНТАРИЕВ 
================================== */

const mainInput =
    document.querySelector('.main-comment-input')

const mainActions =
    document.querySelector('.main-comment-actions')

const mainCancel =
    document.querySelector('.main-comment-cancel')

const commentForm =
    document.getElementById('comment-form')

if (mainInput) {

    mainInput.addEventListener('focus', () => {

        mainActions.style.display = 'flex'

    })

    mainInput.addEventListener('input', function() {

        this.style.height = '38px'

        this.style.height =
            this.scrollHeight + 'px'

    })

}

if (mainCancel) {

    mainCancel.addEventListener('click', () => {

        mainInput.value = ''

        mainInput.style.height = '38px'

        mainInput.style.height = mainInput.scrollHeight + 'px'

        mainActions.style.display = 'none'

        mainInput.blur()

    })

}

if (commentForm) {

    commentForm.addEventListener('submit', function(e) {

        e.preventDefault()

        const formData = new FormData(this)

        fetch(this.action, {

            method: 'POST',

            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },

            body: formData

        })

        .then(response => {

            if (!response.ok) {
                throw new Error('Ошибка сервера')
            }

            return response.json()
        })

        .then(data => {

            if (!data.success) {

                console.log(data)

                return
            }

            const commentsContainer =
                document.getElementById('comments-container')

            const noComments =
                document.getElementById('no-comments')

            if (noComments) {

                noComments.remove()

            }

            commentsContainer.insertAdjacentHTML('afterbegin', data.html)

            const countElement =
                document.getElementById('comments-count')

            if (countElement) {

                const currentCount =
                    parseInt(
                        countElement.textContent.match(/\d+/)[0]
                    )

                countElement.textContent =
                    `Комментарии (${currentCount + 1})`
            }

            commentForm.reset()

            if (mainActions) {
                mainActions.style.display = 'none'
            }

            if (mainInput) {
                mainInput.style.height = '38px'
                mainInput.blur()
            }

        })

        .catch(error => {

            console.error(error)

        })

    })

}

    /* ==================================
        LIKE / DISLIKE (динамические)
    ================================== */

document.querySelectorAll('.like-btn').forEach(button => {

    button.addEventListener('click', function(event) {

        event.preventDefault()

        const commentId = this.dataset.id

        fetch(`/comment/${commentId}/like/`)
        .then(response => response.json())
        .then(data => {

            this.querySelector('.like-count').innerText = data.likes

            if (data.liked) {

                this.classList.add('active-like')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-up-fill'

            } else {

                this.classList.remove('active-like')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-up'

            }

            const dislikeBtn =
                this.parentElement.querySelector('.dislike-btn')

            dislikeBtn.classList.remove('active-dislike')

            dislikeBtn.querySelector('i').className =
                'bi bi-hand-thumbs-down'

            dislikeBtn.querySelector('.dislike-count').innerText =
                data.dislikes

        })

    })

})


document.querySelectorAll('.dislike-btn').forEach(button => {

    button.addEventListener('click', function(event) {

        event.preventDefault()

        const commentId = this.dataset.id

        fetch(`/comment/${commentId}/dislike/`)
        .then(response => response.json())
        .then(data => {

            this.querySelector('.dislike-count').innerText =
                data.dislikes

            if (data.disliked) {

                this.classList.add('active-dislike')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-down-fill'

            } else {

                this.classList.remove('active-dislike')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-down'

            }

            const likeBtn =
                this.parentElement.querySelector('.like-btn')

            likeBtn.classList.remove('active-like')

            likeBtn.querySelector('i').className =
                'bi bi-hand-thumbs-up'

            likeBtn.querySelector('.like-count').innerText =
                data.likes

        })

    })

})


    /* ==================================
        REPLY OPEN
    ================================== */

    const replyToggle = e.target.closest('.reply-toggle')
    if (replyToggle) {

        const comment = replyToggle.closest('.comment')
        const wrapper = comment.querySelector('.reply-form-wrapper')
        const textarea = wrapper.querySelector('textarea')

        wrapper.style.display = 'block'
        replyToggle.style.display = 'none'

        textarea.value = ''
        textarea.style.height = '38px'
        textarea.focus()
    }


    /* ==================================
        REPLY CANCEL
    ================================== */

    const replyCancel = e.target.closest('.reply-cancel')
    if (replyCancel) {

        const wrapper = replyCancel.closest('.reply-form-wrapper')
        const comment = replyCancel.closest('.comment')
        const textarea = wrapper.querySelector('textarea')

        wrapper.style.display = 'none'

        textarea.value = ''
        textarea.style.height = '38px'

        const toggle = comment.querySelector('.reply-toggle')
        if (toggle) toggle.style.display = 'inline-flex'
    }

    /* ==================================
        COMMENT MENU (⋮)
    ================================== */

    const menuBtn = e.target.closest('.comment-menu-btn')
    if (menuBtn) {

        const dropdown = menuBtn.nextElementSibling
        dropdown.classList.toggle('open')
    }

    /* ==================================
        EDIT + SAVE
    ================================== */

    const editBtn = e.target.closest('.edit-toggle')
    if (editBtn) {

        e.preventDefault()

        const comment = editBtn.closest('.comment')

        comment.querySelector('.comment-text').style.display = 'none'
        comment.querySelector('.edit-form-wrapper').style.display = 'block'

        const textarea = comment.querySelector('.edit-input')
        textarea.value = textarea.dataset.original
    }


    const cancelBtn = e.target.closest('.edit-cancel')
    if (cancelBtn) {

        const comment = cancelBtn.closest('.comment')

        comment.querySelector('.comment-text').style.display = 'block'
        comment.querySelector('.edit-form-wrapper').style.display = 'none'
    }


    const saveBtn = e.target.closest('.edit-save')
    if (saveBtn) {

        const comment = saveBtn.closest('.comment')
        const id = saveBtn.dataset.id
        const textarea = comment.querySelector('.edit-input')

        fetch(`/comment/${id}/edit-inline/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ text: textarea.value })
        })
        .then(r => r.json())
        .then(data => {

            const textBlock =
                comment.querySelector('.comment-text')

            textBlock.textContent = data.text

            const textarea =
                comment.querySelector('.edit-input')

            textarea.dataset.original = data.text

            textBlock.style.display = 'block'

            comment.querySelector('.edit-form-wrapper').style.display = 'none'
        })
    }

})

document.addEventListener('submit', function (e) {

    const form = e.target.closest('.reply-form-wrapper form')
    if (!form) return

    e.preventDefault()

    const formData = new FormData(form)

    fetch(form.action, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    })
    .then(r => r.json())
    .then(data => {

        if (!data.success) return

        const wrapper = form.closest('.reply-form-wrapper')

        // ❗ ВСТАВЛЯЕМ В ПРАВИЛЬНОЕ МЕСТО
        const parentComment = form.closest('.comment')

        let repliesContainer = parentComment.querySelector('.replies-container')

        if (!repliesContainer) {
            repliesContainer = document.createElement('div')
            repliesContainer.classList.add('replies-container')
            parentComment.appendChild(repliesContainer)
        }

        repliesContainer.insertAdjacentHTML('beforeend', data.html)

        wrapper.style.display = 'none'
        form.reset()

        const toggle =
            parentComment.querySelector('.reply-toggle')

        if (toggle) {
            toggle.style.display = 'inline-flex'
        }
    })

})

document.addEventListener('click', function (e) {

    if (e.target.closest('.comment-menu-btn')) return

    document
        .querySelectorAll('.comment-menu-dropdown')
        .forEach(menu => {

            menu.classList.remove('open')

        })

})