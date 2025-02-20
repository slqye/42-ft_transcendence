from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and isinstance(response.data, dict):
        detail_messages = []
        for key, value in response.data.items():
            if isinstance(value, list):
                detail_messages.extend(value)
            else:
                detail_messages.append(str(value))
        response.data = {"detail": " ".join(detail_messages)}
    return response