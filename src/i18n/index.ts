import en from './en.json'
import es from './es.json'

export type Locale = 'en' | 'es'
export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: Locale[] = ['en', 'es']

const translations = { en, es }

export function getTranslations(locale: Locale) {
    return translations[locale] ?? translations[DEFAULT_LOCALE]
}

export function getLocaleFromCookie(cookieHeader: string | null): Locale {
    if (!cookieHeader) return DEFAULT_LOCALE
    const match = cookieHeader.match(/(?:^|;\s*)lang=([^;]+)/)
    if (!match) return DEFAULT_LOCALE
    const lang = match[1] as Locale
    return SUPPORTED_LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
}
