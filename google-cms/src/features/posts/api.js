// api.js
const API_URL = 'https://script.google.com/macros/s/AKfycbxcD-3GiXwM7YnKrzgAh9ymVlWCo_dGPDfWnUhppQllhlqMta6acmPCtXDLB1qfDll1/exec';

function encodeForm(data) {
  return Object.keys(data)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');
}

async function doPostRequestForm(payload, errorMsg) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeForm(payload),
  });
  if (!res.ok) {
    throw new Error(`${errorMsg}: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchPosts({ signal } = {}) {
  const res = await fetch(API_URL, { signal });
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export async function createPost({ title, content }) {
  return doPostRequestForm({ action: 'create', title, content }, 'Create failed');
}

export async function updatePost({ id, title, content }) {
  return doPostRequestForm({ action: 'update', id, title, content }, 'Update failed');
}

export async function deletePost({ id }) {
  return doPostRequestForm({ action: 'delete', id }, 'Delete failed');
}

export { API_URL };
