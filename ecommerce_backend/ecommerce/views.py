
from django.shortcuts import get_object_or_404
from .models import Product, Category, Order, Slider, CartItem, Cart
from django.contrib.auth.models import User
from .serializers import (
    ProductSerializer, 
    CategorySerializer, 
    OrderSerializer, 
    SliderSerializer, 
    UserSerializer, 
    OrderItem, 
    CartSerializer
)
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow anyone to signup

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        user = User.objects.get(username=serializer.data['username'])
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'User Created Successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=username)

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': username
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SliderViewSet(viewsets.ModelViewSet):
    queryset = Slider.objects.all()
    serializer_class = SliderSerializer

# class CartViewSet(viewsets.ViewSet):
#     permission_classes = [IsAuthenticated]

#     def list(self, request):
#         cart, created = Cart.objects.get_or_create(user=request.user)
#         serializer = CartSerializer(cart)
#         return Response(serializer.data)

#     def add_to_cart(self, request, product_id):
#         product = get_object_or_404(Product, id=product_id)
#         cart, created = Cart.objects.get_or_create(user=request.user)

#         cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)

#         if not item_created:
#             cart_item.quantity += 1
#             cart_item.save()

#         return Response({'message': 'Product added to cart'}, status=status.HTTP_200_OK)

#     def remove_from_cart(self, request, item_id):
#         try:
#             cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
#             cart_item.delete()
#             return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
#         except CartItem.DoesNotExist:
#             return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)

#     def buy_now(self, request, product_id):
#         product = get_object_or_404(Product, id=product_id)
#         order = Order.objects.create(user=request.user, total_price=product.price)
#         OrderItem.objects.create(order=order, product=product, quantity=1)

#         return Response({'message': 'Order created successfully'}, status=status.HTTP_201_CREATED)

#     def checkout_cart(self, request):
#         cart = get_object_or_404(Cart, user=request.user)
#         cart_items = cart.cartitem_set.all()  # Adjust to your related name

#         if not cart_items:
#             return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

#         total_price = sum(item.product.price * item.quantity for item in cart_items)
#         order = Order.objects.create(user=request.user, total_price=total_price)

#         for item in cart_items:
#             OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity)
        
#         cart_items.delete()  # Clear cart items after checkout

#         return Response({'message': 'Order placed successfully'}, status=status.HTTP_201_CREATED)

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})  # Pass the request context
        return Response(serializer.data)

    def add_to_cart(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not item_created:
            cart_item.quantity += 1
            cart_item.save()

        return Response({'message': 'Product added to cart'}, status=status.HTTP_200_OK)

    def remove_from_cart(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)

    def buy_now(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        order = Order.objects.create(user=request.user, total_price=product.price)
        OrderItem.objects.create(order=order, product=product, quantity=1)

        return Response({'message': 'Order created successfully'}, status=status.HTTP_201_CREATED)

    def checkout_cart(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart_items = cart.cart_items.all()  # Use the related_name defined in CartItem

        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.price * item.quantity for item in cart_items)
        order = Order.objects.create(user=request.user, total_price=total_price)

        for item in cart_items:
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity)
    
        cart_items.delete()  # Clear cart items after checkout

        return Response({'message': 'Order placed successfully'}, status=status.HTTP_201_CREATED)
