from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import (
    Post,
    Comment
)


# forms.py

class PostForm(forms.ModelForm):

    class Meta:
        model = Post
        fields = (
            'title',
            'text',
            'category',
            'tags',
            'image',
        )

        widgets = {
            'tags': forms.HiddenInput()
        }


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