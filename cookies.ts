const MAX_SIGNED_32_BIT_INTEGER = 2 ** 31;

export function cookie(name: string, value?: string | null) {
	if (value === undefined) return `__Host-${name}`;
	if (value === null) return `__Host-${name}=; Max-Age=0; Secure`;
	return `__Host-${name}=${value}; HttpOnly; Max-Age=${MAX_SIGNED_32_BIT_INTEGER}; Path=/; SameSite=Lax; Secure`;
}
