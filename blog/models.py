from django.conf import settings
from django.db import models
from django.utils import timezone


class Category(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Tag(models.Model):

    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Post(models.Model):

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    text = models.TextField()

    created_date = models.DateTimeField(
        default=timezone.now
    )

    published_date = models.DateTimeField(
        blank=True,
        null=True
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    tags = models.ManyToManyField(
        Tag,
        blank=True
    )

    image = models.ImageField(
        upload_to='posts/',
        blank=True,
        null=True
    )

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title


class Comment(models.Model):

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    text = models.TextField()

    created_date = models.DateTimeField(
        auto_now_add=True
    )

    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )

    def __str__(self):
        return f'{self.author}: {self.text[:30]}'