from django.contrib import admin

from .models import (
    Post,
    Category,
    Tag,
    Comment
)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'author',
        'category',
        'published_date',
    )

    list_filter = (
        'category',
        'published_date',
        'tags',
    )

    search_fields = (
        'title',
        'text',
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    search_fields = (
        'name',
    )


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):

    search_fields = (
        'name',
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        'author',
        'post',
        'created_date',
    )

    search_fields = (
        'text',
    )