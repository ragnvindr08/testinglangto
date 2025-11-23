from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Company, Internship, Application

# --- Inline to show Applications in User admin ---
class ApplicationInline(admin.TabularInline):
    model = Application
    extra = 0
    readonly_fields = ('internship', 'status', 'applied_at')  # admin can see only

# --- Extend User admin ---
class UserAdmin(BaseUserAdmin):
    inlines = BaseUserAdmin.inlines + (ApplicationInline,)

# Unregister default User admin and register the new one
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# --- Register Company ---
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'contact_email', 'address')
    search_fields = ('name', 'contact_person', 'contact_email')

# --- Register Internship ---
@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ('position', 'company', 'slots', 'created_at')
    list_filter = ('company',)

# --- Register Application ---
@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'internship', 'status', 'applied_at')
    list_filter = ('status', 'internship__company')
    search_fields = ('student__username', 'internship__position')
