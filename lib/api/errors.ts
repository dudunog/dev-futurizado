export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createErrorResponse(
  error: unknown,
  defaultMessage = "Erro interno do servidor"
) {
  if (error && typeof error === "object" && "issues" in error) {
    return Response.json(
      {
        error: "Erro de validação",
        details: error,
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    const response: { error: string; details?: unknown } = {
      error: error.message,
    };
    if (error.details) {
      response.details = error.details;
    }
    return Response.json(response, { status: error.statusCode });
  }

  const message = error instanceof Error ? error.message : defaultMessage;

  return Response.json(
    {
      error: message,
    },
    { status: 500 }
  );
}
