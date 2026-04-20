export async function unwrapResponse(request) {
  const response = await request;

  if (response.data && response.data.success === false) {
    const error = new Error(response.data.message || "Request failed.");
    error.response = response;
    throw error;
  }

  return response.data?.data ?? null;
}

export function createQueryParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}
