# Generated by Django 4.0.5 on 2022-07-09 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0002_remove_article_template'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='hero_image',
            field=models.ImageField(blank=True, null=True, upload_to='articles'),
        ),
    ]