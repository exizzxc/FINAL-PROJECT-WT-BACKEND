// public/js/api.js
export const API = {
  async request(path, { method = "GET", body, auth = false } = {}) {
    const headers = { Accept: "application/json" };

    if (body) headers["Content-Type"] = "application/json";

    if (auth) {
      const token = localStorage.getItem("token");
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try { data = await res.json(); } catch (_) { data = null; }

    if (!res.ok) {
      const msg = data?.message || `Request failed (${res.status})`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  },

  get(path, opts) { return this.request(path, { ...opts, method: "GET" }); },
  post(path, body, opts) { return this.request(path, { ...opts, method: "POST", body }); },
  put(path, body, opts) { return this.request(path, { ...opts, method: "PUT", body }); },
  del(path, opts) { return this.request(path, { ...opts, method: "DELETE" }); },
};
