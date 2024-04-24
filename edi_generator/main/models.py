from django.db import models

class Invoice(models.Model):
    invoice = models.FileField(upload_to='invoices/')
    

    def __str__(self):
        return self.vendor_invoice.name

# Create your models here.
class BackOfficeType(models.Model):
    name = models.CharField(max_length=30)
    def __str__(self):
        return self.name

class EDI(models.Model):
    edi_file = models.FileField(upload_to='edis/')
    # Your other model fields...
    def __str__(self):
        return self.edi_file.name