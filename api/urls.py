from django.urls import path, include

from rest_framework import routers
from api.views import TaskViewSet, UserViewSet, ManageUserView

router = routers.DefaultRouter()
router.register('tasks', TaskViewSet)
router.register('users', UserViewSet)

urlpatterns = [
    # views内でgenericsを継承している場合はas_viewを使う
    path('myself/', ManageUserView.as_view(), name='myself'),
    
    # ModelViewSetを使っている場合はそのまま呼べる
    path('', include(router.urls))
]
