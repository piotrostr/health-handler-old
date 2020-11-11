# Generated by Django 3.1.1 on 2020-09-07 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_auto_20200903_0029'),
    ]

    operations = [
        migrations.CreateModel(
            name='FoodCupboard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=90)),
                ('store', models.CharField(max_length=20)),
                ('price', models.CharField(max_length=20)),
                ('price_per_unit', models.CharField(max_length=20)),
                ('energy', models.CharField(max_length=20)),
                ('fat', models.CharField(max_length=20)),
                ('saturates', models.CharField(max_length=20)),
                ('carbohydrate', models.CharField(max_length=20)),
                ('sugars', models.CharField(max_length=20)),
                ('fibre', models.CharField(max_length=20)),
                ('protein', models.CharField(max_length=20)),
                ('salt', models.CharField(max_length=20)),
            ],
        ),
    ]