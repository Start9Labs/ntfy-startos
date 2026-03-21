import type { ServiceInterfaceFilled } from '@start9labs/start-sdk/base/lib/util/getServiceInterface'

export const uiPort = 80
export const dataDir = '/data'

/**
 * Pick the best fallback base URL from the service's interface addresses.
 * Priority: mDNS (LAN) → any other non-local HTTP address.
 * Used in main.ts and getAdminCredentials.
 */
export function pickFallbackUrl(i: ServiceInterfaceFilled | null): string | null {
  const addr = i?.addressInfo
  if (!addr) return null

  const mdns = addr.filter({ kind: 'mdns' }).format().find((u) => u.startsWith('http'))
  if (mdns) return mdns

  return addr.nonLocal.format().find((u) => u.startsWith('http')) ?? null
}
