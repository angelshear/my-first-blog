function toggleUserMenu(event) {

    event.stopPropagation()

    document
        .querySelector('.user-menu-dropdown')
        ?.classList
        .toggle('show')
}

document.addEventListener('click', function() {

    document
        .querySelector('.user-menu-dropdown')
        ?.classList
        .remove('show')
})