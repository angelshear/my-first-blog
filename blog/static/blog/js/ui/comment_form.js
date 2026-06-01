document.addEventListener('DOMContentLoaded', () => {

    const mainInput = document.querySelector('.main-comment-input')
    const mainActions = document.querySelector('.main-comment-actions')
    const mainCancel = document.querySelector('.main-comment-cancel')

    if (!mainInput || !mainActions) return

    const showActions = () => {
        mainActions.style.display = 'flex'
    }

    const hideActions = () => {
        mainActions.style.display = 'none'
    }

    mainInput.addEventListener('focus', showActions)

    mainInput.addEventListener('input', function () {

        showActions()

        this.style.height = '38px'
        this.style.height = this.scrollHeight + 'px'
    })

    mainCancel?.addEventListener('click', () => {

        mainInput.value = ''

        mainInput.style.height = '38px'

        hideActions()

        mainInput.blur()
    })

})