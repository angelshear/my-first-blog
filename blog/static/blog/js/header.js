function toggleUserMenu(event) {

    event.stopPropagation()

    const menu =
        event.currentTarget
            .parentElement
            .querySelector('.user-menu-dropdown')

    menu.classList.toggle('show')
}

document.addEventListener('click', function () {

    document
        .querySelectorAll('.user-menu-dropdown')
        .forEach(menu => menu.classList.remove('show'))
})