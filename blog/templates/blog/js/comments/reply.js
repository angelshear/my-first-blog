/* ==================================
  ФОРМА ВВОДА ВЛОЖЕННЫХ КОММЕНТАРИЕВ
================================== */

// OPEN reply form
document.querySelectorAll('.reply-toggle').forEach(button => {

    button.addEventListener('click', function () {

        const comment = this.closest('.comment')
        const wrapper = comment.querySelector('.reply-form-wrapper')
        const textarea = wrapper.querySelector('textarea')

        wrapper.style.display = 'block'
        this.style.display = 'none'

        // reset state
        textarea.value = ''
        textarea.style.height = '38px'

        textarea.focus()
    })

})


// CLOSE reply form (cancel)
document.querySelectorAll('.reply-cancel').forEach(button => {

    button.addEventListener('click', function () {

        const wrapper = this.closest('.reply-form-wrapper')
        const comment = this.closest('.comment')
        const textarea = wrapper.querySelector('textarea')

        wrapper.style.display = 'none'

        textarea.value = ''
        textarea.style.height = '38px'

        const toggle = comment.querySelector('.reply-toggle')
        if (toggle) {
            toggle.style.display = 'inline-flex'
        }
    })

})


// AUTO RESIZE for reply textarea ONLY
document.querySelectorAll('.reply-input').forEach(textarea => {

    textarea.addEventListener('input', function () {
        this.style.height = '38px'
        this.style.height = this.scrollHeight + 'px'
    })

})