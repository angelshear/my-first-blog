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

// ОТКРЫТИЕ ОКНА УДАЛЕНИЯ ПОСТА

const modal = document.getElementById('deletePostModal')
const deletePostBtn = document.getElementById('deletePostBtn')

if (deletePostBtn && modal) {

    deletePostBtn.addEventListener('click', function (e) {

        e.preventDefault()

        modal.classList.add('show')
    })
}

// ОТМЕНА УДАЛЕНИЯ ПОСТА

document
.getElementById('cancelDeletePost')
?.addEventListener('click', function () {

    modal?.classList.remove('show')
})

// КЛИК ПО ФОНУ МОДАЛКИ

modal?.addEventListener('click', function (e) {

    if (e.target === modal) {

        modal.classList.remove('show')
    }
})