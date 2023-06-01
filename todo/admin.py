from django.contrib import admin
from .models import Task

# List on admin panel


class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')


# Register the model

admin.site.register(Task, TaskAdmin)
