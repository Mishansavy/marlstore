from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ProductViewSet, CategoryViewSet, OrderViewSet, UserViewSet, SliderViewSet, CartViewSet

# Create a router and register the viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'sliders', SliderViewSet)  # Consistent naming
router.register(r'users', UserViewSet, basename='user')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),  # Include viewsets routers

    # JWT authentication routes
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token

    # Cart-related routes
    path('cart/', CartViewSet.as_view({'get': 'list'}), name='cart_list'),  # View Cart
    path('cart/add/<int:product_id>/', CartViewSet.as_view({'post': 'add_to_cart'}), name='add_to_cart'),  # Add to Cart
    path('cart/remove/<int:item_id>/', CartViewSet.as_view({'delete': 'remove_from_cart'}), name='remove_from_cart'),  # Remove from Cart

    # Order-related routes
    path('order/buy_now/<int:product_id>/', CartViewSet.as_view({'post': 'buy_now'}), name='buy_now'),  # Buy Now
    path('order/checkout/', CartViewSet.as_view({'post': 'checkout_cart'}), name='checkout_cart'),  # Checkout Cart
]
