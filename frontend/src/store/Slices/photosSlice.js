import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_BASE || "http://localhost:7070";

// helper fetch
async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": body instanceof FormData ? undefined : "application/json",
    },
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}

/* ============ THUNK-LAR (ENDPOINTLƏR) ============ */
export const uploadPhotoFile = createAsyncThunk("photos/uploadFile", async (file) => {
  const API = import.meta.env.VITE_API_BASE || "http://localhost:7070";
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url; // yüklənən faylın URL-i
});


// LIST: GET /api/photo
export const fetchPhotos = createAsyncThunk("photos/fetchAll", async (params) => {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", params.page);
  if (params?.limit) q.set("limit", params.limit);
  if (params?.search) q.set("search", params.search);
  const data = await request(`/api/photo${q.toString() ? `?${q}` : ""}`);
  if (Array.isArray(data)) return data;
  if (data?.items) return data.items;
  return [];
});

// GET BY ID: /api/photo/:id
export const fetchPhotoById = createAsyncThunk("photos/fetchById", async (id) => {
  return await request(`/api/photo/${id}`);
});

// CREATE: POST /api/photo
export const createPhoto = createAsyncThunk("photos/create", async (payload) => {
  const res = await request(`/api/photo`, { method: "POST", body: payload });
  if (res?.id) {
    // tam obyekt lazımdırsa
    return await request(`/api/photo/${res.id}`);
  }
  return res; // backend tam obyekt qaytarırsa
});

// PATCH: /api/photo/:id
export const updatePhoto = createAsyncThunk(
  "photos/update",
  async ({ id, data }) => {
    return await request(`/api/photo/${id}`, { method: "PATCH", body: data });
  }
);

// PUT: /api/photo/:id
export const replacePhoto = createAsyncThunk(
  "photos/replace",
  async ({ id, data }) => {
    const replaced = await request(`/api/photo/${id}`, { method: "PUT", body: data });
    if (!replaced || !replaced._id) return await request(`/api/photo/${id}`);
    return replaced;
  }
);

// DELETE: /api/photo/:id
export const deletePhoto = createAsyncThunk("photos/delete", async (id) => {
  await request(`/api/photo/${id}`, { method: "DELETE" });
  return id;
});

/* ============ SLICE ============ */

const initialState = {
  items: [],
  current: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Fetch failed";
      });

    // GET BY ID
    builder
      .addCase(fetchPhotoById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPhotoById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload || null;
      })
      .addCase(fetchPhotoById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Fetch by id failed";
      });

    // CREATE
    builder
      .addCase(createPhoto.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPhoto.fulfilled, (state, action) => {
        state.status = "succeeded";
        const doc = action.payload;
        if (doc && doc._id) state.items.unshift(doc);
      })
      .addCase(createPhoto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Create failed";
      });

    // PATCH
    builder
      .addCase(updatePhoto.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload;
        if (updated && updated._id) {
          state.items = state.items.map((i) => (i._id === updated._id ? updated : i));
          if (state.current && state.current._id === updated._id) state.current = updated;
        }
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Update failed";
      });

    // PUT
    builder
      .addCase(replacePhoto.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(replacePhoto.fulfilled, (state, action) => {
        state.status = "succeeded";
        const replaced = action.payload;
        if (replaced && replaced._id) {
          state.items = state.items.map((i) => (i._id === replaced._id ? replaced : i));
          if (state.current && state.current._id === replaced._id) state.current = replaced;
        }
      })
      .addCase(replacePhoto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Replace failed";
      });

    // DELETE
    builder
      .addCase(deletePhoto.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.status = "succeeded";
        const id = action.payload;
        state.items = state.items.filter((i) => i._id !== id);
        if (state.current && state.current._id === id) state.current = null;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Delete failed";
      });
  },
});

export const { clearCurrent } = photosSlice.actions;
export default photosSlice.reducer;
