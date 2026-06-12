from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView

urlpatterns = [

    # =====================================================
    # POSTS
    # =====================================================

    # Главная страница
    path(
        '',
        views.post_list,
        name='post_list'
    ),

    # Детали статьи
    path(
        'post/<int:pk>/',
        views.post_detail,
        name='post_detail'
    ),

    # Создание статьи
    path(
        'post/new/',
        views.post_new,
        name='post_new'
    ),

    # Редактирование статьи
    path(
        'post/<int:pk>/edit/',
        views.post_edit,
        name='post_edit'
    ),

    # Удаление статьи
    path(
        'post/<int:pk>/delete/',
        views.post_delete,
        name='post_delete'
    ),

    # =====================================================
    # SEARCH
    # =====================================================

    # Теги
    path(
        'tag/<slug:slug>/',
        views.posts_by_tag,
        name='posts_by_tag'
    ),

    # =====================================================
    # AUTH
    # =====================================================

    # Регистрация
    path(
        'register/',
        views.register,
        name='register'
    ),

    # Выход
    path(
        'logout/',
        LogoutView.as_view(),
        name='logout'
    ),

    # =====================================================
    # COMMENTS
    # =====================================================

    # Добавление комментария / reply
    path(
        'post/<int:pk>/comment/',
        views.add_comment,
        name='add_comment'
    ),

    # Редактирование комментария
    path(
        'comment/<int:pk>/edit-inline/',
        views.edit_comment_inline,
        name='edit_comment_inline'
    ),

    # Удаление комментария
    path(
        'comment/<int:pk>/delete/',
        views.delete_comment,
        name='delete_comment'
    ),

    # =====================================================
    # COMMENT REACTIONS
    # =====================================================

    # Like comment
    path(
        'comment/<int:pk>/like/',
        views.like_comment,
        name='like_comment'
    ),

    # Dislike comment
    path(
        'comment/<int:pk>/dislike/',
        views.dislike_comment,
        name='dislike_comment'
    ),

]