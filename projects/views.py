from django.shortcuts import render
from .models import Project

def project_index(request):
    projects = Project.objects.all()
    context = { 
        'projects': projects 
    }
    print(context)
    print(projects.first().image)
    return render(request, 'projects/index.html', context)

def project_detail(request):
    projects = Project.objects.all()
    return render(request, 'projects/detail.html')