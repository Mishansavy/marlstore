from django.contrib import admin
from .models import Product, Order , Category, OrderItem, Slider, CartItem
# Register your models here.
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Category)
admin.site.register(OrderItem)
admin.site.register(Slider)
admin.site.register(CartItem)