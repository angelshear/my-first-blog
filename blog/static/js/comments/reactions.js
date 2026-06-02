/* =========================
           LIKE
========================= */
document.querySelectorAll('.like-btn').forEach(button => {

    button.addEventListener('click', function(event) {

        event.preventDefault()

        const commentId = this.dataset.id

        fetch(`/comment/${commentId}/like/`)
        .then(response => response.json())
        .then(data => {

            this.querySelector('.like-count').innerText = data.likes

            if (data.liked) {

                this.classList.add('active-like')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-up-fill'

            } else {

                this.classList.remove('active-like')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-up'

            }

            const dislikeBtn =
                this.parentElement.querySelector('.dislike-btn')

            dislikeBtn.classList.remove('active-dislike')

            dislikeBtn.querySelector('i').className =
                'bi bi-hand-thumbs-down'

            dislikeBtn.querySelector('.dislike-count').innerText =
                data.dislikes

        })

    })

})

/* =========================
           DISLIKE
========================= */

document.querySelectorAll('.dislike-btn').forEach(button => {

    button.addEventListener('click', function(event) {

        event.preventDefault()

        const commentId = this.dataset.id

        fetch(`/comment/${commentId}/dislike/`)
        .then(response => response.json())
        .then(data => {

            this.querySelector('.dislike-count').innerText =
                data.dislikes

            if (data.disliked) {

                this.classList.add('active-dislike')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-down-fill'

            } else {

                this.classList.remove('active-dislike')

                this.querySelector('i').className =
                    'bi bi-hand-thumbs-down'

            }

            const likeBtn =
                this.parentElement.querySelector('.like-btn')

            likeBtn.classList.remove('active-like')

            likeBtn.querySelector('i').className =
                'bi bi-hand-thumbs-up'

            likeBtn.querySelector('.like-count').innerText =
                data.likes

        })

    })

})