export function hasServiceAuthorization(request: Request, serviceKey: string | undefined): boolean {
  return Boolean(serviceKey && request.headers.get("authorization") === `Bearer ${serviceKey}`);
}

export function hasSharedSecret(request: Request, name: string, secret: string | undefined): boolean {
  return Boolean(secret && request.headers.get(name) === secret);
}
