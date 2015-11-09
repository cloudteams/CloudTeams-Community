from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    url(r'^admin/', include(admin.site.urls)),
    url(r'^activitytracker/', include('activitytracker.urls')),
    url(r'', include('social.apps.django_app.urls', namespace='social')),

    # projects
    url(r'^projects/', include('ct_projects.urls')),

    # user profile wizard
    url(r'^profile/', include('profile.urls')),

    # home page redirect
    url(r'^$', RedirectView.as_view(url='activitytracker/', permanent=True)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
