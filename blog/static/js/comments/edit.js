/* ==================================
    РЕДАКТИРОВАНИЕ КОММЕНТАРИЕВ
================================== */

// включение режима редактирования
document.querySelectorAll('.edit-toggle').forEach(btn => {

    btn.addEventListener('click', function(e) {
        e.preventDefault()

        const comment = this.closest('.comment')

        const textBlock = comment.querySelector('.comment-text')
        const editBox = comment.querySelector('.edit-form-wrapper')
        const textarea = comment.querySelector('.edit-input')

        // скрыть текст
        textBlock.style.display = 'none'

        // показать редактор
        editBox.style.display = 'block'

        // загрузить исходный текст
        textarea.value = textarea.dataset.original

        // пересчитать высоту
        textarea.style.height = '44px'
        textarea.style.height = textarea.scrollHeight + 'px'
        textarea.focus()
    })

})

// включение режима редактирования для вложенных комментарие
document.querySelectorAll('.edit-input').forEach(textarea => {

    textarea.addEventListener('input', function() {

        this.style.height = '44px'

        this.style.height =
            this.scrollHeight + 'px'

    })

})

// отмена редактирования
document.querySelectorAll('.edit-cancel').forEach(btn => {

    btn.addEventListener('click', function() {

        const comment = this.closest('.comment')

        comment.querySelector('.comment-text').style.display = 'block'
        comment.querySelector('.edit-form-wrapper').style.display = 'none'
    })

})

// сохранение изменений
document.querySelectorAll('.edit-save').forEach(btn => {

    btn.addEventListener('click', function() {

        const comment = this.closest('.comment')
        const id = this.dataset.id
        const textarea = comment.querySelector('.edit-input')
        const newText = textarea.value

        fetch(`/comment/${id}/edit-inline/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ text: newText })
        })
        .then(res => res.json())
        .then(data => {

                const textBlock =
                    comment.querySelector('.comment-text')

                textBlock.textContent = data.text

                textarea.dataset.original = data.text

                textBlock.style.display = 'block'

                comment.querySelector('.edit-form-wrapper').style.display =
                    'none'
        })

    })

})