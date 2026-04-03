/**
 * src/lib/auth.ts
 * JWT auth helpers — sin librerías externas, usando Web Crypto API
 */

const SECRET = import.meta.env.JWT_SECRET ?? 'dev-secret-change-in-production'
const COOKIE_NAME = 'crm_token'
const EXPIRES_IN = 60 * 60 * 8 // 8 horas en segundos

// ─── JWT manual (HS256) ───────────────────────────────────────────────────────

function base64url(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    while (str.length % 4) str += '='
    return atob(str)
}

async function hmacSign(data: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
    return base64url(String.fromCharCode(...new Uint8Array(sig)))
}

export async function createToken(payload: Record<string, unknown>): Promise<string> {
    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = base64url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + EXPIRES_IN }))
    const sig = await hmacSign(`${header}.${body}`)
    return `${header}.${body}.${sig}`
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
    try {
        const [header, body, sig] = token.split('.')
        const expected = await hmacSign(`${header}.${body}`)
        if (sig !== expected) return null
        const payload = JSON.parse(base64urlDecode(body))
        if (payload.exp < Math.floor(Date.now() / 1000)) return null
        return payload
    } catch {
        return null
    }
}

// ─── Password hashing (PBKDF2 + salt) ────────────────────────────────────────
// Uses Web Crypto API — no external dependencies.
// Format stored in DB: pbkdf2:<salt_hex>:<hash_hex>

const PBKDF2_ITERATIONS = 200_000
const PBKDF2_HASH = 'SHA-256'
const KEY_LENGTH = 32 // bytes

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    )
    const derived = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: PBKDF2_HASH },
        keyMaterial,
        KEY_LENGTH * 8
    )
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
    const hashHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('')
    return `pbkdf2:${saltHex}:${hashHex}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    // Legacy SHA-256 format (plain hex, no prefix) — still works, migrates on next login
    if (!stored.startsWith('pbkdf2:')) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
        const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
        return hex === stored
    }
    const [, saltHex, hashHex] = stored.split(':')
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    )
    const derived = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: PBKDF2_HASH },
        keyMaterial,
        KEY_LENGTH * 8
    )
    const candidateHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('')
    return candidateHex === hashHex
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export function getTokenFromCookie(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
    return match ? match[1] : null
}

export function makeAuthCookie(token: string): string {
    return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${EXPIRES_IN}`
}

export function makeClearCookie(): string {
    return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export async function isAuthenticated(cookieHeader: string | null): Promise<boolean> {
    const token = getTokenFromCookie(cookieHeader)
    if (!token) return false
    const payload = await verifyToken(token)
    return payload !== null
}
