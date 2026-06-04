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

const modal =
    document.getElementById('deletePostModal')

const deletePostBtn = document.getElementById('deletePostBtn')

const modal = document.getElementById('deletePostModal')

if (deletePostBtn && modal) {

    deletePostBtn.addEventListener('click', function (e) {

        e.preventDefault()

        modal.classList.add('show')
    })
}

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