document.addEventListener('DOMContentLoaded', () => {

    const addBtn = document.getElementById('add-tag-btn')
    const input = document.getElementById('tag-input')
    const container = document.getElementById('tags-container')
    const hiddenField = document.getElementById('id_tags')

    let tags = []

    const initialData = document.getElementById('initial-tags')

    if (initialData) {
        tags = JSON.parse(initialData.textContent)
    }

    renderTags()

    // КЛИК ПО КНОПКЕ
    addBtn.addEventListener('click', () => {

        // скрываем кнопку
        addBtn.style.display = 'none'

        // показываем input
        input.style.display = 'block'
        input.focus()
    })

    input.addEventListener('keydown', (e) => {

        if (e.key === 'Enter') {
            e.preventDefault()

            const value = input.value.trim()
            if (!value) return

            tags.push(value)
            renderTags()

            input.value = ''

            // (опционально) можно оставить input видимым
        }
    })

    input.addEventListener('blur', () => {
        input.style.display = 'none'
        addBtn.style.display = 'inline-block'
    })

    function renderTags() {
        container.innerHTML = ''

        tags.forEach((tag, index) => {

            const span = document.createElement('span')
            span.className = 'tag-chip'

            // текст тега
            const text = document.createElement('span')
            text.textContent = '#' + tag

            // кнопка удаления
            const removeBtn = document.createElement('button')
            removeBtn.type = 'button'
            removeBtn.textContent = '×'
            removeBtn.className = 'tag-remove-btn'

            // клик по удалению
            removeBtn.addEventListener('click', () => {
                tags.splice(index, 1)
                renderTags()
            })

            span.appendChild(text)
            span.appendChild(removeBtn)
            container.appendChild(span)
        })

        hiddenField.value = tags.join(',')
    }
})