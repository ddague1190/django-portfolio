from django.contrib import admin
from projects.models import Project, ProjectImage, Tag, Tech
from django.contrib.admin.widgets import AdminFileWidget
from django.db import models
from django.utils.safestring import mark_safe

class AdminImageWidget(AdminFileWidget):
    def render(self, name, value, attrs=None, renderer=None):
        output = []
        if value and getattr(value, "url", None):
            image_url = value.url
            file_name = str(value)
            output.append(u' <a href="%s" target="_blank"><img src="%s" alt="%s" width="100" height="100"  style="object-fit: cover;"/></a>' %
                          (image_url, image_url, file_name))
        output.append(super(AdminFileWidget, self).render(name, value, attrs))
        return mark_safe(u''.join(output))

class ProjectImagesInline(admin.TabularInline):
    model = ProjectImage
    fk_name = 'project'
    extra = 1
    formfield_overrides = {models.ImageField: {'widget': AdminImageWidget}}

class TagsInline(admin.TabularInline):
    model = Tag
    fk_name = 'project'
    extra = 1

class TechInline(admin.TabularInline):
    model = Tech
    fk_name = 'project'
    extra = 1

class ProjectAdmin(admin.ModelAdmin):
    inlines = [ProjectImagesInline, TagsInline, TechInline]

admin.site.register(Project, ProjectAdmin)
admin.site.register(Tag)
