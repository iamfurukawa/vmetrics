export class LocalStorageService<T> {
    save(key: string, value: T): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(key, JSON.stringify(value));
    }

    get(key: string): T | null | undefined {
        if (typeof window === 'undefined') return null;
        
        const value = localStorage.getItem(key);
        if (!value) {
            return null;
        }
        JSON.parse(value);
    }
}