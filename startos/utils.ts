import { SubContainer, T, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'

export const uiPort = 80
export const dataDir = '/data'

// Host id (the `sdk.MultiHost.of` group) vs. the interface id exported on it —
// distinct ids, both needed for `sdk.host.getOwn` lookups.
export const uiHostId = 'ui-multi'
export const uiInterfaceId = 'ui'

export const authFile = `${dataDir}/auth.db`
export const cacheFile = `${dataDir}/cache.db`
export const webPushFile = `${dataDir}/webpush.db`
export const attachmentDir = `${dataDir}/attachments`
export const settingsFile = `${dataDir}/settings.yaml`

export const randomPassword = {
  charset: 'a-z,A-Z,1-9',
  len: 22,
}

export function generateAdminPassword(): string {
  return utils.getDefaultString(randomPassword)
}

export const mainMounts = (readonly = false) =>
  sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: dataDir,
    readonly,
  })

export const withMainSub = <R>(
  effects: T.Effects,
  name: string,
  readonly: boolean,
  fn: (sub: SubContainer<typeof sdk.manifest>) => Promise<R>,
): Promise<R> =>
  sdk.SubContainer.withTemp(
    effects,
    { imageId: 'main' },
    mainMounts(readonly),
    name,
    fn,
  )

// Only the monitoring actions authenticate against the running server; the
// management actions drive the CLI against /data instead, which is what makes
// them work on a wedged instance. Keep that split.
export const adminAuth = async (): Promise<{
  baseUrl: string
  authHeader: string
}> => {
  const token = await storeJson.read((s) => s.adminToken).once()
  if (!token) {
    throw new Error('Admin token not found. Run "Set Admin Password" first.')
  }
  return {
    baseUrl: `http://localhost:${uiPort}`,
    authHeader: `Bearer ${token}`,
  }
}

export type NtfyPermission = 'read-write' | 'read-only' | 'write-only' | 'deny'

export type NtfyUser = {
  username: string
  role: 'admin' | 'user' | 'anonymous'
  tier: string
  grants: Array<{ topic: string; permission: NtfyPermission }>
}

export const listUsers = async (): Promise<NtfyUser[]> => {
  const { baseUrl, authHeader } = await adminAuth()
  const res = await fetch(`${baseUrl}/v1/users`, {
    headers: { Authorization: authHeader },
  })
  if (!res.ok) {
    throw new Error(`Failed to list users: HTTP ${res.status}`)
  }
  // ntfy serializes `tier` and `grants` with omitempty, so they're absent
  // (not empty) when there are none. Normalize here so callers can always
  // iterate `grants` and read `tier`.
  const raw = (await res.json()) as Array<Partial<NtfyUser>>
  return raw.map((u) => ({
    username: u.username ?? '',
    role: u.role ?? 'user',
    tier: u.tier ?? '',
    grants: u.grants ?? [],
  }))
}
