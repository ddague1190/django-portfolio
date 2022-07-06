from re import T
from django.db import models



class Project(models.Model):
    featured = models.BooleanField(default=False)
    title = models.CharField(max_length=100)
    intro_statement = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField()
    logo_pic = models.ImageField(upload_to='projects')
    date = models.DateField()
    github_url = models.URLField(blank=True, null=True)
    website_link = models.URLField(blank=True, null=True)
    preview_image = models.ImageField(upload_to='projects')

    def __str__(self):
        return self.title


class Tech(models.Model):
    template = models.CharField(max_length=100)
    project = models.ForeignKey(Project, related_name='tech', on_delete=models.CASCADE)

class Tag(models.Model):
    tag = models.CharField(max_length=100)
    image = models.ImageField(upload_to='tags')
    project = models.ForeignKey(Project, related_name='tags', on_delete=models.CASCADE)

class ProjectImage(models.Model):
    image = models.ImageField(upload_to='projects')
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    
