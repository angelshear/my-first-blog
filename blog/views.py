from django.shortcuts import (
    render,
    get_object_or_404,
    redirect
)

from django.utils import timezone

from django.contrib.auth.decorators import login_required

from django.core.paginator import Paginator

from django.db.models import Q

from .models import (
    Post,
    Comment
)

from .forms import (
    PostForm,
    CommentForm,
    RegisterForm
)


# Список постов + поиск + пагинация
def post_list(request):

    query = request.GET.get('q')

    posts = Post.objects.filter(
        published_date__lte=timezone.now()
    )

    if query:

        posts = posts.filter(
            Q(title__icontains=query) |
            Q(text__icontains=query)
        )

    posts = posts.order_by('-published_date')

    paginator = Paginator(posts, 5)

    page_number = request.GET.get('page')

    page_obj = paginator.get_page(page_number)

    return render(
        request,
        'blog/post_list.html',
        {
            'page_obj': page_obj,
            'query': query,
        }
    )


# Детали поста
def post_detail(request, pk):

    post = get_object_or_404(Post, pk=pk)

    comments = post.comments.filter(
        parent__isnull=True
    ).order_by('-created_date')

    comment_form = CommentForm()

    return render(
        request,
        'blog/post_detail.html',
        {
            'post': post,
            'comments': comments,
            'comment_form': comment_form,
        }
    )


# Создание поста
@login_required
def post_new(request):

    if request.method == "POST":

        form = PostForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            post = form.save(commit=False)

            post.author = request.user
            post.published_date = timezone.now()

            post.save()

            form.save_m2m()

            return redirect(
                'post_detail',
                pk=post.pk
            )

    else:

        form = PostForm()

    return render(
        request,
        'blog/post_edit.html',
        {'form': form}
    )


# Редактирование поста
@login_required
def post_edit(request, pk):

    post = get_object_or_404(Post, pk=pk)

    # Только автор может редактировать

    if request.user != post.author:

        return HttpResponseForbidden(
            "You cannot edit someone else's post."
        )

    if request.method == "POST":

        form = PostForm(
            request.POST,
            request.FILES,
            instance=post
        )

        if form.is_valid():

            post = form.save(commit=False)

            post.author = request.user
            post.published_date = timezone.now()

            post.save()

            form.save_m2m()

            return redirect(
                'post_detail',
                pk=post.pk
            )

    else:

        form = PostForm(instance=post)

    return render(
        request,
        'blog/post_edit.html',
        {'form': form}
    )


# Удаление поста
@login_required
def post_delete(request, pk):

    post = get_object_or_404(Post, pk=pk)

    # Только автор может удалить

    if request.user != post.author:

        return HttpResponseForbidden(
            "You cannot delete someone else's post."
        )

    post.delete()

    return redirect('post_list')


# Регистрация пользователя
def register(request):

    if request.method == 'POST':

        form = RegisterForm(request.POST)

        if form.is_valid():

            form.save()

            return redirect('login')

    else:

        form = RegisterForm()

    return render(
        request,
        'registration/register.html',
        {'form': form}
    )


# Добавление комментария
@login_required
def add_comment(request, pk):

    post = get_object_or_404(Post, pk=pk)

    if request.method == 'POST':

        form = CommentForm(request.POST)

        if form.is_valid():

            comment = form.save(commit=False)

            comment.post = post
            comment.author = request.user

            parent_id = request.POST.get('parent_id')

            if parent_id:

                parent_comment = Comment.objects.get(
                    id=parent_id
                )

                comment.parent = parent_comment

            comment.save()

    return redirect(
        'post_detail',
        pk=pk
    )

# Удаление комментария
@login_required
def delete_comment(request, pk):

    comment = get_object_or_404(Comment, pk=pk)

    # Только автор комментария
    # ИЛИ автор поста

    if (
        request.user != comment.author
        and
        request.user != comment.post.author
    ):

        return HttpResponseForbidden(
            "You cannot delete this comment."
        )

    post_pk = comment.post.pk

    comment.delete()

    return redirect(
        'post_detail',
        pk=post_pk
    )