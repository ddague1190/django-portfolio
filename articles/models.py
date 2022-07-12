from datetime import datetime
from distutils.command.upload import upload
from django.db import models
from django.template.defaultfilters import slugify

class Article(models.Model):
    grid_image = models.ImageField(upload_to='articles')
    preview_image = models.ImageField(upload_to='articles')
    hero_image = models.ImageField(upload_to='articles', null=True, blank=True)
    date = models.DateField(default=datetime.now)
    github_url = models.URLField(blank=True, null=True)
    website_link = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    slug = models.SlugField(max_length=200, null=True, blank=True)


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = f"article/{slugify(self.title)}"
        super(Article, self).save(*args, **kwargs)