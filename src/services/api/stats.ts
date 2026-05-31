import { API_BASE } from './client';

export async function getHistory(page: number = 1) {
  try { 
    const res = await fetch(`${API_BASE}/history`); 
    const data = await res.json();
    return data;
  } catch { return []; }
}

export async function getHistoryDetail(id: number | string) {
  try { const res = await fetch(`${API_BASE}/history/${id}`); return await res.json(); } catch { return {}; }
}
