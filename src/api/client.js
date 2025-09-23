export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
export const GEOAPIFY_API_KEY =
  process.env.EXPO_PUBLIC_GEOAPIFY_KEY || '51ae09d1b6d54bffad71aa21e969f714';

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}
