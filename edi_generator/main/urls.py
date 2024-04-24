from django.urls import path

from . import views

urlpatterns = [
    path("edi-generator/",views.upload_invoice,name="edi-generator"),
    path("backOfficeTypes/",views.getBackOfficeTypes,name="backOfficeTypes")
]