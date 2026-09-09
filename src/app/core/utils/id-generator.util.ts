export function generateId(prefix: string): string {
    const random = Math.random().toString(36).slice(2, 9);
    const timestamp = Date.now().toString(36);
    return `${prefix}-${timestamp}-${random}`;
}
