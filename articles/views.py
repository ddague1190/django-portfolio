from django.shortcuts import render
from .models import Article
# Create your views here.
def article_view(request, slug):
    article = Article.objects.get(slug=f"article/{slug}")
    context = {
        'article': article
    }
    return render(request, f"article/{slug}.html", context)