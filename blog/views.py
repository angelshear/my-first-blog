import json

from django.shortcuts import (
    render,
    get_object_or_404,
    redirect
)

from django.utils import timezone

from django.contrib.auth.decorators import login_required

from django.contrib.auth import login

from django.core.paginator import Paginator

from django.db.models import Q, Count, F, FloatField, ExpressionWrapper

from django.http import HttpResponseForbidden, JsonResponse

from django.template.loader import render_to_string

from .models import (
    Post,
    Comment,
    Tag,
    Category
)

from .forms import (
    PostForm,
    CommentForm,
    RegisterForm
)


# =========================================================
# POSTS LIST + SEARCH + PAGINATION
# =========================================================

def post_list(request):

    query = request.GET.get('q')

    posts = Post.objects.filter(
        published_date__lte=timezone.now()
    )

    # SEARCH

    if query:

        posts = posts.filter(
            Q(title__icontains=query) |
            Q(text__icontains=query) |
            Q(category__name__icontains=query) |
            Q(tags__name__icontains=query)
        ).distinct()

    # SORT POSTS

    posts = posts.order_by(
        '-published_date'
    )

    # PAGINATION

    paginator = Paginator(posts, 5)

    page_number = request.GET.get('page')

    page_obj = paginator.get_page(page_number)

    return render(

        request,

        'blog/posts/post_list.html',

        {
            'page_obj': page_obj,
            'query': query,
        }

    )


# =========================================================
# POST DETAIL + COMMENTS + SORTING
# =========================================================

def post_detail(request, pk):

    post = get_object_or_404(Post, pk=pk)

    sort = request.GET.get('sort', 'new')

    # 1. БАЗОВЫЙ QUERYSET (только корневые комментарии)
    comments = post.comments.filter(parent__isnull=True)

    # 2. АННОТАЦИИ (делаются один раз для всех режимов)
    comments = comments.annotate(
        likes_count=Count('likes', distinct=True),
        dislikes_count=Count('dislikes', distinct=True),
        replies_count=Count('replies', distinct=True),
    )

    # 3. СОРТИРОВКА
    if sort == 'old':

        comments = comments.order_by('created_date')

    elif sort == 'popular':

        comments = comments.annotate(
            score=ExpressionWrapper(
                F('likes_count')
                - F('dislikes_count')
                + F('replies_count') * 0.2,
                output_field=FloatField()
            )
        ).order_by('-score', '-created_date')

    else:

        comments = comments.order_by('-created_date')

    # 4. FORM
    comment_form = CommentForm()

    return render(request, 'blog/posts/post_detail.html', {
        'post': post,
        'comments': comments,
        'comment_form': comment_form,
        'current_sort': sort,
    })

# =========================================================
# CATEGORY
# =========================================================

def posts_by_category(request, category_id):

    category = get_object_or_404(
        Category,
        id=category_id
    )

    posts = Post.objects.filter(
        category=category,
        published_date__isnull=False
    ).order_by('-published_date')

    return render(
        request,
        'blog/posts/post_list.html',
        {
            'page_obj': posts,
            'selected_category': category,
        }
    )

# =========================================================
# SEARCH BY TAG
# =========================================================

def posts_by_tag(request, slug):

    tag = get_object_or_404(
        Tag,
        slug=slug
    )

    posts = Post.objects.filter(
        tags=tag,
        published_date__isnull=False
    ).order_by('-published_date')

    return render(
        request,
        'blog/posts/post_list.html',
        {
            'page_obj': posts,
            'selected_tag': tag
        }
    )

# =========================================================
# CREATE POST
# =========================================================

@login_required
def post_new(request):

    if request.method == "POST":

        form = PostForm(

            request.POST,
            request.FILES

        )

        if form.is_valid():

            post = form.save(
                commit=False
            )

            post.author = request.user

            post.published_date = timezone.now()

            post.save()

            tags_string = request.POST.get('tags', '')

            for tag_name in tags_string.split(','):

                tag_name = tag_name.strip().lower()

                if not tag_name:
                    continue

                tag, created = Tag.objects.get_or_create(
                    name=tag_name
                )

                post.tags.add(tag)

            return redirect(
                'post_detail',
                pk=post.pk
            )

    else:

        form = PostForm()

    return render(
        request,
        'blog/posts/post_edit.html',
        {
            'form': form,
            'title': 'Новый пост',
            'tags': []
        }
    )


# =========================================================
# EDIT POST
# =========================================================

@login_required
def post_edit(request, pk):

    post = get_object_or_404(
        Post,
        pk=pk
    )

    # ONLY AUTHOR

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

            old_image = post.image.name if post.image else None

            post = form.save(commit=False)

            remove_image = request.POST.get('remove_image') == '1'
            new_image = request.FILES.get('image')

            if remove_image and not new_image:
                post.image = None

            post.save()

            if remove_image and not new_image and old_image:
                from django.core.files.storage import default_storage

                if default_storage.exists(old_image):
                    default_storage.delete(old_image)

            if new_image and old_image and old_image != post.image.name:
                from django.core.files.storage import default_storage

                if default_storage.exists(old_image):
                    default_storage.delete(old_image)

            tags_string = request.POST.get('tags', '')

            post.tags.clear()

            for tag_name in tags_string.split(','):

                tag_name = tag_name.strip().lower()

                if not tag_name:
                    continue

                tag, created = Tag.objects.get_or_create(
                    name=tag_name
                )

                post.tags.add(tag)

            return redirect(
                'post_detail',
                pk=post.pk
            )

    else:

        form = PostForm(
            instance=post
        )

    return render(
        request,
        'blog/posts/post_edit.html',
        {
            'form': form,
            'post': post,
            'title': 'Редактирование поста',
            'tags': list(post.tags.values_list('name', flat=True))
        }
    )

# =========================================================
# DELETE POST
# =========================================================

@login_required
def post_delete(request, pk):

    post = get_object_or_404(
        Post,
        pk=pk
    )

    # Свои посты могут удалять авторы и администратор

    if request.user != post.author and not request.user.is_superuser:

        return HttpResponseForbidden(

            "You cannot delete someone else's post."

        )

    post.delete()

    return redirect(
        'post_list'
    )


# =========================================================
# USER REGISTRATION
# =========================================================

def register(request):

    if request.method == 'POST':

        form = RegisterForm(
            request.POST
        )

        if form.is_valid():

            user = form.save()

            # AUTO LOGIN AFTER REGISTER

            login(
                request,
                user
            )

            return redirect(
                'post_list'
            )

    else:

        form = RegisterForm()

    return render(

        request,

        'registration/register.html',

        {
            'form': form
        }

    )

# =========================================================
# COMMENT COUNTER
# =========================================================

def get_replies_count(comment):

    total = 0

    for reply in comment.replies.all():

        total += 1
        total += get_replies_count(reply)

    return total

# =========================================================
# ADD COMMENT / REPLY
# =========================================================

@login_required
def add_comment(request, pk):

    post = get_object_or_404(
        Post,
        pk=pk
    )

    if request.method == 'POST':

        form = CommentForm(
            request.POST
        )

        if form.is_valid():

            comment = form.save(
                commit=False
            )

            comment.post = post
            comment.author = request.user

            # REPLY

            parent_id = request.POST.get('parent_id')

            if parent_id:

                parent_comment = get_object_or_404(
                    Comment,
                    id=parent_id
                )

                comment.parent = parent_comment

            comment.save()

            if comment.parent:

                html = render_to_string(

                    'blog/comments/reply_item.html',

                    {
                        'reply': comment,
                        'user': request.user,
                    },

                    request=request

                )

            else:

                html = render_to_string(

                    'blog/comments/comment_item.html',

                    {
                        'comment': comment,
                        'post': post,
                        'user': request.user,
                    },

                    request=request

                )

            return JsonResponse({

                'success': True,

                'html': html,

                'parent_id': (
                    comment.parent.id
                    if comment.parent
                    else None
                )

            })

        return JsonResponse({

            'success': False,

            'errors': form.errors

        })

    return JsonResponse({

        'success': False,

        'message': 'Invalid request'

    })


# =========================================================
# DELETE COMMENT
# =========================================================

@login_required
def delete_comment(request, pk):

    comment = get_object_or_404(
        Comment,
        pk=pk
    )

    # AUTHOR / POST AUTHOR / ADMIN

    if (
        request.user != comment.author
        and request.user != comment.post.author
        and not request.user.is_staff
    ):

        return JsonResponse(
            {'success': False},
            status=403
        )

    deleted_count = 1 + get_replies_count(comment)

    comment.delete()

    return JsonResponse({
        'success': True,
        'deleted_count': deleted_count,
    })


# =========================================================
# EDIT COMMENT
# =========================================================

@login_required
def edit_comment_inline(request, pk):

    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    comment = get_object_or_404(Comment, pk=pk)

    # ONLY AUTHOR OR STAFF
    if request.user != comment.author and not request.user.is_staff:
        return HttpResponseForbidden("You cannot edit this comment.")

    try:
        data = json.loads(request.body)
        new_text = data.get("text", "").strip()

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not new_text:
        return JsonResponse({"error": "Empty comment"}, status=400)

    comment.text = new_text
    comment.save()

    return JsonResponse({
        "success": True,
        "text": comment.text
    })


# =========================================================
# LIKE COMMENT
# =========================================================

@login_required
def like_comment(request, pk):

    comment = get_object_or_404(Comment, pk=pk)

    liked = False

    if request.user in comment.likes.all():

        comment.likes.remove(request.user)

    else:

        comment.likes.add(request.user)

        comment.dislikes.remove(request.user)

        liked = True

    return JsonResponse({

        'likes': comment.total_likes(),
        'dislikes': comment.total_dislikes(),
        'liked': liked,
        'disliked': False,

    })


# =========================================================
# DISLIKE COMMENT
# =========================================================

@login_required
def dislike_comment(request, pk):

    comment = get_object_or_404(Comment, pk=pk)

    disliked = False

    if request.user in comment.dislikes.all():

        comment.dislikes.remove(request.user)

    else:

        comment.dislikes.add(request.user)

        comment.likes.remove(request.user)

        disliked = True

    return JsonResponse({

        'likes': comment.total_likes(),
        'dislikes': comment.total_dislikes(),
        'liked': False,
        'disliked': disliked,

    })