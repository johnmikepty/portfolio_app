/**
 * Convierte markdown inline básico a HTML.
 * Soporta: **bold**, *italic*, [link](url)
 */
export function markdownInline(text: string): string {
    return text
        // **bold**
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // *italic*
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // [link](url)
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}
