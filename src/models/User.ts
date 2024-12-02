export interface User {
    /** Format: int64 */
    id: number;
    name: string;
    email?: string;
    watch_list?: string[];
}

export interface PartialUser {
    /** Format: int64 */
    value: number;
    label: string;
}
