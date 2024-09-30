"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponse = void 0;
class HttpResponse {
    SuccessResponse(message = "Success", payload = null) {
        return {
            success: true,
            statusCode: 200,
            message,
            payload,
        };
    }
    CreatedResponse(message = "Resource created successfully", payload = null) {
        return {
            success: true,
            statusCode: 201,
            message,
            payload,
        };
    }
    BadRequestException(message = "Bad request exception", payload = null) {
        return {
            success: false,
            statusCode: 400,
            message,
            payload,
        };
    }
    UnauthorizedException(message = "Unauthorized exception", payload = null) {
        return {
            success: false,
            statusCode: 401,
            message,
            payload,
        };
    }
    ForbiddenException(message = "Forbidden exception", payload = null) {
        return {
            success: false,
            statusCode: 403,
            message,
            payload,
        };
    }
    NotFoundException(message = "Not found exception", payload = null) {
        return {
            success: false,
            statusCode: 404,
            message,
            payload,
        };
    }
    InternalServerErrorException(message = "Internal server error", payload = null) {
        return {
            success: false,
            statusCode: 500,
            message,
            payload,
        };
    }
}
exports.httpResponse = new HttpResponse();
