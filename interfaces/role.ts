export interface Permission {
    id: number;
    name: string;
    parent_id: number;
    description: string;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[]
}