from django.urls import path
from . import views


urlpatterns = [

    # Главная страница
    path('', views.post_list, name='post_list'),

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

    # Регистрация
    path(
        'register/',
        views.register,
        name='register'
    ),

    # Добавление комментария
    path(
        'post/<int:pk>/comment/',
        views.add_comment,
        name='add_comment'
    ),
]