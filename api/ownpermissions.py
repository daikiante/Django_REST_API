from rest_framework import permissions


class ProfilePermission(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        # DBに対する破壊的メソッド(変更/削除)を受け付けない設定にしてく
        if request.method in permissions.SAFE_METHODS:
            return True
        return False