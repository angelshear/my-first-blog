/* ==================================
  ФОРМА ВВОДА ВЛОЖЕННЫХ КОММЕНТАРИЕВ
================================== */

// AUTO RESIZE for reply textarea ONLY
document.querySelectorAll('.reply-input').forEach(textarea => {

    textarea.addEventListener('input', function () {
        this.style.height = '38px'
        this.style.height = this.scrollHeight + 'px'
    })

})

/* ==================================
   AJAX ОТВЕТЫ НА КОММЕНТАРИИ
================================== */

document.querySelectorAll('.reply-form-wrapper form').forEach(form => {

    form.addEventListener('submit', function(e) {

        e.preventDefault()

        const formData = new FormData(this)

        fetch(this.action, {

            method: 'POST',

            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },

            body: formData

        })

        .then(response => response.json())

        .then(data => {

            if (!data.success) {
                console.log(data)
                return
            }

            location.reload()

        })

        .catch(error => {
            console.error(error)
        })

    })

})