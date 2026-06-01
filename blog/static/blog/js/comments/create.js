document.addEventListener('DOMContentLoaded', () => {

    const commentForm = document.getElementById('comment-form')

    if (!commentForm) return

    commentForm.addEventListener('submit', function (e) {

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

            const commentsContainer = document.getElementById('comments-container')

            const html = `
                <div class="comment" style="margin-bottom:30px;">

                    <p class="comment-meta">
                        <strong>${data.author}</strong>
                        <span class="text-muted">• ${data.date}</span>
                    </p>

                    <p class="comment-text"></p>

                </div>
            `

            const noComments = document.getElementById('no-comments')

            if (noComments) {
                noComments.remove()
            }

            commentsContainer.insertAdjacentHTML('afterbegin', html)

            const newComment = commentsContainer.firstElementChild

            newComment.querySelector('.comment-text').textContent = data.text

            const countElement = document.getElementById('comments-count')

            if (countElement) {

                const match = countElement.textContent.match(/\d+/)

                if (match) {

                    const currentCount = parseInt(match[0])

                    countElement.textContent =
                        `Комментарии (${currentCount + 1})`
                }
            }

            // reset form UI safely (без конфликтов)
            const mainInput = document.querySelector('.main-comment-input')
            const mainActions = document.querySelector('.main-comment-actions')

            commentForm.reset()

            if (mainInput) {
                mainInput.style.height = '38px'
                mainInput.blur()
            }

            if (mainActions) {
                mainActions.style.display = 'none'
            }

        })
        .catch(error => {
            console.error(error)
        })

    })

})