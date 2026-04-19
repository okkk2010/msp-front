export async function unwrapResponse(request) {
  const response = await request;
  return response.data?.data ?? null;
}

export function createQueryParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}
