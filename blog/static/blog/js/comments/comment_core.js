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

document.addEventListener('click', function (e) {

    /* ==================================
        LIKE
    ================================== */

    const likeBtn = e.target.closest('.like-btn')

    if (likeBtn) {

        e.preventDefault()

        const id = likeBtn.dataset.id

        fetch(`/comment/${id}/like/`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(r => r.json())
        .then(data => {

            likeBtn.querySelector('.like-count').textContent =
                data.likes

            if (data.liked) {

                likeBtn.classList.add('active-like')

                likeBtn.querySelector('i').className =
                    'bi bi-hand-thumbs-up-fill'

            } else {

                likeBtn.classList.remove('active-like')

                likeBtn.querySelector('i').className =
                    'bi bi-hand-thumbs-up'
            }

            const dislikeBtn =
                likeBtn.parentElement.querySelector('.dislike-btn')

            if (dislikeBtn) {

                dislikeBtn.classList.remove('active-dislike')

                dislikeBtn.querySelector('i').className =
                    'bi bi-hand-thumbs-down'

                dislikeBtn.querySelector('.dislike-count').textContent =
                    data.dislikes
            }
        })

        return
    }

    /* ==================================
        DISLIKE
    ================================== */

    const dislikeBtn = e.target.closest('.dislike-btn')

    if (dislikeBtn) {

        e.preventDefault()

        const id = dislikeBtn.dataset.id

        fetch(`/comment/${id}/dislike/`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(r => r.json())
        .then(data => {

            dislikeBtn.querySelector('.dislike-count').textContent =
                data.dislikes

            if (data.disliked) {

                dislikeBtn.classList.add('active-dislike')

                dislikeBtn.querySelector('i').className =
                    'bi bi-hand-thumbs-down-fill'

            } else {

                dislikeBtn.classList.remove('active-dislike')

                dislikeBtn.querySelector('i').className =
                    'bi bi-hand-thumbs-down'
            }

            const likeBtn =
                dislikeBtn.parentElement.querySelector('.like-btn')

            if (likeBtn) {

                likeBtn.classList.remove('active-like')

                likeBtn.querySelector('i').className =
                    'bi bi-hand-thumbs-up'

                likeBtn.querySelector('.like-count').textContent =
                    data.likes
            }
        })

        return
    }

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
        textarea.style.height = 'auto'
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
        textarea.style.height = 'auto'

        const toggle = comment.querySelector('.reply-toggle')
        if (toggle) toggle.style.display = 'inline-flex'
    }

    /* ==================================
        COMMENT MENU (⋮)
    ================================== */

    const menuBtn = e.target.closest('.comment-menu-btn')
    if (menuBtn) {

        const dropdown = menuBtn.nextElementSibling
        dropdown.classList.toggle('show')
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

        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'

        textarea.focus()
    }


    const cancelBtn = e.target.closest('.edit-cancel')
    if (cancelBtn) {

        const comment = cancelBtn.closest('.comment')
        const textarea = comment.querySelector('.edit-input')

        textarea.style.height = 'auto'

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

            menu.classList.remove('show')

        })

})

/* ==================================
    AUTO RESIZE EDIT TEXTAREA
================================== */

document.addEventListener('input', function (e) {

    const textarea = e.target.closest('.edit-input')

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'

})

/* ==================================
    AUTO RESIZE REPLY TEXTAREA
================================== */

document.addEventListener('input', function (e) {

    const textarea = e.target.closest('.reply-input')

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'

})