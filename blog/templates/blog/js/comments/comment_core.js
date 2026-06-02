document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // ELEMENTS
    // =========================
    const form = document.getElementById('comment-form')
    const input = document.querySelector('.main-comment-input')
    const actions = document.querySelector('.main-comment-actions')
    const cancelBtn = document.querySelector('.main-comment-cancel')
    const container = document.getElementById('comments-container')
    const countElement = document.getElementById('comments-count')

    if (!form || !input || !actions) return

    // =========================
    // UI HELPERS
    // =========================
    function showActions() {
        actions.style.display = 'flex'
    }

    function hideActions() {
        actions.style.display = 'none'
    }

    function resetForm() {
        form.reset()
        input.style.height = '38px'
        input.blur()
        hideActions()
    }

    function autoResize() {
        input.style.height = '38px'
        input.style.height = input.scrollHeight + 'px'
    }

    // =========================
    // UI EVENTS
    // =========================

    input.addEventListener('focus', showActions)

    input.addEventListener('input', () => {
        showActions()
        autoResize()
    })

    cancelBtn?.addEventListener('click', (e) => {
        e.preventDefault()
        resetForm()
    })

    // =========================
    // SUBMIT COMMENT
    // =========================
    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(form)

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error('Server error')
            }

            const data = await response.json()

            if (!data.success) {
                console.log(data)
                return
            }

            // =========================
            // RENDER NEW COMMENT
            // =========================
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
            if (noComments) noComments.remove()

            container.insertAdjacentHTML('afterbegin', html)

            const newComment = container.firstElementChild
            newComment.querySelector('.comment-text').textContent = data.text

            // =========================
            // UPDATE COUNT
            // =========================
            if (countElement) {
                const match = countElement.textContent.match(/\d+/)
                if (match) {
                    const current = parseInt(match[0])
                    countElement.textContent = `Комментарии (${current + 1})`
                }
            }

            // =========================
            // RESET FORM
            // =========================
            resetForm()

        } catch (err) {
            console.error(err)
        }
    })

})