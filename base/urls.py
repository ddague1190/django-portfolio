from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from . import settings
from articles.views import article_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('article/<slug>', article_view),
    path('projects', include('projects.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)