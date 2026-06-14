from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django_select2.forms import Select2MultipleWidget

from .models import (
    Post,
    Comment
)

class PostForm(forms.ModelForm):

    tags = forms.CharField(
        required=False,
        help_text="Через запятую"
    )

    class Meta:
        model = Post
        fields = (
            'title',
            'text',
            'image',
            'category',
            'tags',
        )


class CommentForm(forms.ModelForm):

    class Meta:

        model = Comment

        fields = (
            'text',
        )


class RegisterForm(UserCreationForm):

    class Meta:

        model = User

        fields = (
            'username',
            'password1',
            'password2',
        )