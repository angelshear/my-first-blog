document.addEventListener('DOMContentLoaded', () => {

    const addBtn =
        document.getElementById('add-tag-btn')

    const input =
        document.getElementById('tag-input')

    const container =
        document.getElementById('tags-container')

    const hiddenField =
        document.getElementById('id_tags')

    let tags = []

    addBtn.addEventListener('click', () => {

        input.style.display = 'block'

        input.focus()
    })

    input.addEventListener('keydown', (e) => {

        if (e.key === 'Enter') {

            e.preventDefault()

            const value =
                input.value.trim()

            if (!value) return

            tags.push(value)

            renderTags()

            input.value = ''
        }
    })

    input.addEventListener('blur', () => {

        input.style.display = 'none'
    })

    function renderTags() {

        container.innerHTML = ''

        tags.forEach(tag => {

            const span =
                document.createElement('span')

            span.className = 'tag-chip'

            span.textContent = '#' + tag

            container.appendChild(span)
        })

        hiddenField.value =
            tags.join(',')
    }
})