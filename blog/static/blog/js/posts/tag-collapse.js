document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.post-tags').forEach(container => {

        const tags = container.querySelectorAll('.tag-item')
        const btn = container.querySelector('.tags-more-btn')

        if (!btn) return

        const MAX_VISIBLE = 5

        if (tags.length <= MAX_VISIBLE) {
            btn.style.display = 'none'
            return
        }

        tags.forEach((tag, index) => {
            if (index >= MAX_VISIBLE) {
                tag.style.display = 'none'
            }
        })

        btn.style.display = 'inline-block'

        let expanded = false

        btn.addEventListener('click', () => {

            expanded = !expanded

            if (expanded) {

                tags.forEach(tag => {
                    tag.style.display = 'inline-block'
                })

                btn.textContent = 'Скрыть'

            } else {

                tags.forEach((tag, index) => {
                    if (index >= MAX_VISIBLE) {
                        tag.style.display = 'none'
                    }
                })

                btn.textContent = 'Ещё...'
            }
        })
    })
})