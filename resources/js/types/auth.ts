export type Role = 'owner' | 'admin' | 'member' | 'slave';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    bio: string | null;
    age: number | null;
    location: string | null;
    profile_picture_url: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
};

export type Auth = {
    user: User | null;
};
