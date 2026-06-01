/* ==================================
      ФОРМА ВВОДА КОММЕНТАРИЕВ
================================== */

const mainInput =
    document.querySelector('.main-comment-input')

const mainActions =
    document.querySelector('.main-comment-actions')

const mainCancel =
    document.querySelector('.main-comment-cancel')

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