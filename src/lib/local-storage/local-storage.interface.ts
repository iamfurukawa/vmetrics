export interface LocalStorage<T> {
    save(value: T): void;
    get(): T | null | undefined;
}