export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  updatedAt?: string;
}

const PROFILE_STORAGE_KEY = 'marvin_user_profile';

export function getSavedUserProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    return data ? (JSON.parse(data) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: Partial<UserProfile>): void {
  try {
    const existing = getSavedUserProfile() || {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    };
    const updated: UserProfile = {
      ...existing,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save user profile to localStorage:', err);
  }
}

export function clearSavedUserProfile(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear user profile from localStorage:', err);
  }
}
