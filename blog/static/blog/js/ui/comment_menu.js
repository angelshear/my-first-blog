/* ==================================
  МЕНЮ РЕДАКТИРОВАНИЯ КОММЕНТАРИЕВ
================================== */

function toggleCommentMenu(event, button) {

    event.stopPropagation()

    document
        .querySelectorAll('.comment-menu-dropdown')
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
        .querySelectorAll('.comment-menu-dropdown')
        .forEach(menu => {

            menu.classList.remove('show')

        })

})