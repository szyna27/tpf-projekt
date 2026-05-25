import { API_BASE } from './client';

export async function getTrainingPlans() {
  try {
    const res = await fetch(`${API_BASE}/plans`);
    return await res.json();
  } catch { return []; }
}

export async function createTrainingPlan(data: any) { return data; }
export async function deleteTrainingPlan(id: number) { return true; }

export async function getPlan(id: number | string) {
  try { const res = await fetch(`${API_BASE}/plans/${id}`); return await res.json(); } catch { return {}; }
}

export async function savePlan(id: number | null, data: any) { return data; }
export async function deletePlan(id: number) { return true; }

export async function addExercise(planId: number, data: any) { return {}; }
export async function deleteExercise(a: any, b?: any): Promise<any> { return true; }
export async function getTrainingPlan(id: number | string) { return getPlan(id); }
export async function updateExercise(a: any, b?: any, c?: any): Promise<any> { return b; }
export async function updateTrainingPlan(id: number, data: any) { return savePlan(id, data); }
export async function addPlanSet(a: any, b?: any, c?: any): Promise<any> { return {}; }
export async function deletePlanSet(a: any, b?: any, c?: any): Promise<any> { return true; }