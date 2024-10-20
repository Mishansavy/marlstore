from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Category, Order, OrderItem, Slider, Cart, CartItem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    # to ensure password are write-only
    extra_kwargs = {
        'password': {'write_only':True}
    }

    #Override the 'create' method to hash the password
    def create(self, validate_data):
        user = User( username=validate_data['username']
        )
        user.set_password(validate_data['password'])
        user.save()
        return user

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
    
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class SliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slider
        fields = '__all__'

# class CartItemSerializer(serializers.ModelSerializer):
#     product = ProductSerializer()
#     class Meta:
#         model = CartItem
#         fields = ['id', 'product', 'quantity']

# class CartSerializer(serializers.ModelSerializer):
#     items = CartItemSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = Cart
#         fields = ['id', 'user', 'items', 'created_at']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    image = serializers.SerializerMethodField()  # Field for the full image URL
    price = serializers.SerializerMethodField()  # Field for the product price

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'image', 'price']

    def get_image(self, obj):
        """Return the full image URL."""
        request = self.context.get('request')
        return request.build_absolute_uri(obj.product.image.url) if obj.product.image else None

    def get_price(self, obj):
        """Return the product price as a string."""
        return str(obj.product.price)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='cart_items' ,many=True, read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']