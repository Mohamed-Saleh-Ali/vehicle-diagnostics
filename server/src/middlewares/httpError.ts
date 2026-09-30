// errorHandler reads cause.status and uses it as the response status
export const httpError = (status: number, message: string) => new Error(message, { cause: { status } });
