// РЕДАКТИРОВАНИЕ ПОСТА

function togglePostMenu(event, button) {

    event.stopPropagation()

    document
        .querySelectorAll('.post-menu-dropdown')
        .forEach(menu => {

            if (
                menu !==
                button.nextElementSibling
            ) {

                menu.classList.remove('show')
            }

        })

    button
        .nextElementSibling
        .classList
        .toggle('show')
}

document.addEventListener('click', function() {

    document
        .querySelectorAll('.post-menu-dropdown')
        .forEach(menu => {

            menu.classList.remove('show')
        })

})

// МОДАЛЬНОЕ ОКНО УДАЛЕНИЯ ПОСТА

const modal =
    document.getElementById('deletePostModal')

const confirmBtn =
    document.getElementById('confirmDeletePost')

document.addEventListener('click', function(e) {

    const deleteBtn =
        e.target.closest('.post-delete-btn')

    if (!deleteBtn) return

    e.preventDefault()

    const deleteUrl =
        deleteBtn.dataset.deleteUrl

    confirmBtn.href = deleteUrl

    modal.classList.add('show')
})

// ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА

document
.getElementById('cancelDeletePost')
?.addEventListener('click', function() {

    modal.classList.remove('show')
})

modal?.addEventListener('click', function(e) {

    if (e.target === modal) {

        modal.classList.remove('show')
    }
})