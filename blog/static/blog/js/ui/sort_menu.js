/* =========================
  СОРТИРОВКА КОММЕНТАРИЕВ
========================= */

function toggleSortMenu(event) {

    event.preventDefault()

    document
        .getElementById('sortMenu')
        .classList.toggle('show')

}

document.addEventListener('click', function(event) {

    const menu =
        document.getElementById('sortMenu')

    const button =
        document.querySelector('.sort-btn')

    if (
        !menu.contains(event.target)
        &&
        !button.contains(event.target)
    ) {

        menu.classList.remove('show')

    }

})