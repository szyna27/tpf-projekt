import { API_BASE } from './client';

export async function getExerciseCatalog(search?: string) {
  try { const res = await fetch(`${API_BASE}/exercises`); return await res.json(); } catch { return []; }
}
export async function searchExerciseCatalog(search: string) {
  try { const res = await fetch(`${API_BASE}/exercises`); return await res.json(); } catch { return []; }
}
export async function listUserExercises() {
  try { 
    const res = await fetch(`${API_BASE}/user-exercises`); 
    return await res.json(); 
  } catch { return []; }
}
export async function getExercises() {
  try { const res = await fetch(`${API_BASE}/exercises`); return await res.json(); } catch { return []; }
}
export async function getBaseExercises() {
  try { const res = await fetch(`${API_BASE}/exercises`); return await res.json(); } catch { return []; }
}
export async function createExercise(data: any) { return data; }
export async function createUserExerciseAdvanced(data: any) { 
  const payload = { ...data, id: Date.now(), brand: 'custom' };
  try {
    await fetch(`${API_BASE}/user-exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {}
  return payload; 
}
export async function updateUserExercise(id: number, data: any) { 
  try {
    const res = await fetch(`${API_BASE}/user-exercises/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    return result;
  } catch {}
  return { ...data, id }; 
}
export async function deleteUserExercise(id: number) { 
  try {
    await fetch(`${API_BASE}/user-exercises/${id}`, { method: 'DELETE' });
  } catch {}
  return true; 
}
export async function getExerciseAttributes() { 
  return {
    equipments: ["Barbell", "Dumbbell", "Bodyweight", "Machine", "Cable", "Bands", "Kettlebell"], 
    target_muscles: ["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Core", "Quads", "Hamstrings"] 
  };
}
export async function uploadUserExerciseImage(file: File) { 
  return new Promise<{ public_url: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ public_url: reader.result as string });
    reader.onerror = () => reject('Failed to convert image');
    reader.readAsDataURL(file);
  });
}
export function titleCaseName(name: string) { return name; }