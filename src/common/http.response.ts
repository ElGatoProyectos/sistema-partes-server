export type T_HttpResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  payload: unknown;
};

class HttpResponse {
  SuccessResponse(
    message: string = "Success",
    payload: any = null
  ): T_HttpResponse {
    return {
      success: true,
      statusCode: 200,
      message,
      payload,
    };
  }

  CreatedResponse(
    message: string = "Resource created successfully",
    payload: any = null
  ): T_HttpResponse {
    return {
      success: true,
      statusCode: 201,
      message,
      payload,
    };
  }

  BadRequestException(
    message: string = "Bad request exception",
    payload: any = null
  ): T_HttpResponse {
    return {
      success: false,
      statusCode: 400,
      message,
      payload,
    };
  }

  UnauthorizedException(
    message: string = "Unauthorized exception",
    payload: any = null
  ): T_HttpResponse {
    return {
      success: false,
      statusCode: 401,
      message,
      payload,
    };
  }

  ForbiddenException(
    message: string = "Forbidden exception",
    payload: any = null
  ): T_HttpResponse {
    return {
      success: false,
      statusCode: 403,
      message,
      payload,
    };
  }

  NotFoundException(
    message: string = "Not found exception",
    payload: any = null
  ): T_HttpResponse {
    return {
      success: false,
      statusCode: 404,
      message,
      payload,
    };
  }

  InternalServerErrorException(
    message: string = "Internal server error",
    payload: any = null
  ): T_HttpResponse {
    return {
      success: false,
      statusCode: 500,
      message,
      payload,
    };
  }
}

export const httpResponse = new HttpResponse();
