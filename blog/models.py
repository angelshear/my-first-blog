from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Category(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Tag(models.Model):

    name = models.CharField(
        max_length=50,
        unique=True
    )

    slug = models.SlugField(
        unique=True,
        blank=True,
        max_length=100
    )

    def save(self, *args, **kwargs):
    if not self.slug:
        base_slug = slugify(self.name, allow_unicode=True)
        slug = base_slug
        counter = 1

        while Tag.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        self.slug = slug

    super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    title = models.CharField("Заголовок", max_length=200)

    text = models.TextField("Содержание")

    category = models.ForeignKey(
        Category,
        verbose_name="Категория",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    tags = models.ManyToManyField(
        Tag,
        verbose_name="Теги",
        blank=True
    )

    image = models.ImageField(
        "Изображение",
        upload_to='posts/',
        blank=True,
        null=True
    )

    created_date = models.DateTimeField(
        default=timezone.now
    )

    published_date = models.DateTimeField(
        blank=True,
        null=True
    )

    def total_comments(self):

        return self.comments.count()

    def __str__(self):

        return self.title


class Comment(models.Model):

    SORT_CHOICES = (
        ('new', 'Newest'),
        ('old', 'Oldest'),
        ('popular', 'Popular'),
    )

    post = models.ForeignKey(
        Post,
        related_name='comments',
        on_delete=models.CASCADE
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='replies',
        on_delete=models.CASCADE
    )

    text = models.TextField()

    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_comments',
        blank=True
    )

    dislikes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='disliked_comments',
        blank=True
    )

    created_date = models.DateTimeField(
        auto_now_add=True
    )

    updated_date = models.DateTimeField(
        auto_now=True
    )

    def total_likes(self):

        return self.likes.count()

    def total_dislikes(self):

        return self.dislikes.count()

    def __str__(self):

        return f'{self.author} - {self.post}'