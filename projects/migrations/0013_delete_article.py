# Generated by Django 4.0.5 on 2022-07-08 11:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0012_article_template'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Article',
        ),
    ]