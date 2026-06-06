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

// Открытие окна удаления

document.addEventListener('click', function(e) {

    const deleteBtn =
        e.target.closest('.post-delete-btn')

    if (!deleteBtn) return

    e.preventDefault()

    const postId =
        deleteBtn.dataset.postId

    const modal =
        document.getElementById(
            `deletePostModal-${postId}`
        )

    if (modal) {
        modal.classList.add('show')
    }
})

document.addEventListener('click', function(e) {

    if (
        e.target.classList.contains(
            'delete-modal-cancel'
        )
    ) {

        const modal =
            e.target.closest(
                '.delete-modal-overlay'
            )

        modal.classList.remove('show')
    }

    if (
        e.target.classList.contains(
            'delete-modal-overlay'
        )
    ) {

        e.target.classList.remove('show')
    }
})