# Generated by Django 4.0.5 on 2022-07-01 13:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_project_featured'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='tags',
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to='tags')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='projects.project')),
            ],
        ),
    ]
