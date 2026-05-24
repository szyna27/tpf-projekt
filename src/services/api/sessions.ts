import { API_BASE } from './client';

export async function getSessions() {
  try { const res = await fetch(`${API_BASE}/sessions`); return await res.json(); } catch { return []; }
}
export async function getActiveSessions() {
  try { const res = await fetch(`${API_BASE}/sessions`); return await res.json(); } catch { return []; }
}
export async function getSession(id: number | string) {
  try { const res = await fetch(`${API_BASE}/sessions/${id}`); return await res.json(); } catch { return {}; }
}
export async function saveSessionData(id: number, data: any) { return {}; }
export async function startSession(data: any) { return { id: 1, ...data }; }
export async function finishSession(id: any, payload?: any): Promise<any> { return true; }
export async function discardSession(id: number) { return true; }
export async function addSessionExercise(id: number, data: any) { return {}; }
export async function deleteSessionExercise(id: number | string, exId?: number | string) { return true; }
export async function updateSessionExercise(id: number | string, dataOrId: any, dataOrNothing?: any) { return {}; }
export async function addSet(eId: number | string, exIdOrData?: any, dataOrNothing?: any) { return {}; }
export async function updateSet(a?: any, b?: any, c?: any, d?: any): Promise<any> { return {}; }
export async function deleteSet(a?: any, b?: any, c?: any): Promise<any> { return true; }
export async function updatePlanSet(planId: any, exId: any, sId?: any, data?: any) { return {}; }
export async function saveSessionExercise(eId: number, opts: any) { return true; }