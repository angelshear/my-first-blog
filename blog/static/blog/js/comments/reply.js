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