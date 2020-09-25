from django.shortcuts import render

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from django.contrib.auth.models import User
from .models import Task
from rest_framework import viewsets

from .serializers import TaskSerializer, UserSerializer

from .ownpermissions import ProfilePermission


class UserViewSet(viewsets.ModelViewSet):
    # ModelViewSet : CRUD全て使えるようになっている
    
    queryset = User.objects.all()
    
    # シリアライザーの指定
    serializer_class = UserSerializer
    
    # 誰でもアクセス可能
    permission_classes = (ProfilePermission,)
    

class ManageUserView(generics.RetrieveUpdateAPIView):
    # /myself は作成、更新だけなのでRetrieveUpdateAPIViewを使っている
    
    serializer_class = UserSerializer
    
    # 認証が通った人だけアクセスできる設定
    authentication_classes = (TokenAuthentication,)
    
    # ログインしているユーザーのみ設定
    permission_classes = (IsAuthenticated,)
    
    def get_object(self):
        # ログインしているユーザー情報だけを返す
        return self.request.user
    

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    
    serializer_class = TaskSerializer
    
    # 認証が通った人だけアクセスできる設定
    authentication_classes = (TokenAuthentication,)
    
    # ログインしているユーザーのみ設定
    permission_classes = (IsAuthenticated,)