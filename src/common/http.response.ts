export type T_HttpResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  payload: unknown;
};

class HttpResponse {
  http200(
    message: string = "Fetch ok",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: true,
      message,
      statusCode: 200,
      payload,
    };
  }

  http201(
    message: string = "Entity created",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: true,
      message,
      statusCode: 201,
      payload,
    };
  }

  http400(
    message: string = "Bad Request",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: false,
      message,
      statusCode: 400,
      payload,
    };
  }

  http401(
    message: string = "Unauthorized",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: false,
      message,
      statusCode: 401,
      payload,
    };
  }

  http403(
    message: string = "Forbidden",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: false,
      message,
      statusCode: 403,
      payload,
    };
  }

  http404(
    message: string = "Not Found",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: false,
      message,
      statusCode: 404,
      payload,
    };
  }

  http500(
    message: string = "Internal Server Error",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: false,
      message,
      statusCode: 500,
      payload,
    };
  }

  http503(
    message: string = "Service Unavailable",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: false,
      message,
      statusCode: 503,
      payload,
    };
  }

  http504(
    message: string = "Gateway Timeout",
    payload: null | unknown
  ): T_HttpResponse {
    return {
      success: false,
      message,
      statusCode: 504,
      payload,
    };
  }
}

export const httpResponse = new HttpResponse();
