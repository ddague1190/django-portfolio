from django.shortcuts import render
from projects.models import Project
from articles.models import Article
from django.views.generic.list import ListView


class HomePageList(ListView):
    context_object_name = 'project_list'
    queryset = Project.objects.filter(featured=True)
    template_name = 'core/index.html'
    # template_name = 'test.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        articles = Article.objects.all()
        context['article_list'] = articles
        return context