import { UserProfile } from '../types';
import { DEMO_PRESETS } from '../data/presets';

const STORAGE_KEY = 'careerpath_ai_profile_v1';

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEMO_PRESETS.ai_student);
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed.interests || !parsed.skills || !parsed.constraints) {
      return structuredClone(DEMO_PRESETS.ai_student);
    }
    return parsed;
  } catch {
    return structuredClone(DEMO_PRESETS.ai_student);
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}
