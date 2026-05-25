import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const AppContext = createContext(null);

const STORAGE_KEY = "taskr-data";

/** Map old darkMode boolean + no theme to new theme value */
function migrateState(saved) {
  if (saved.theme) return saved;
  if (saved.darkMode) {
    saved.theme = "dark";
  } else {
    saved.theme = "light";
  }
  delete saved.darkMode;
  return saved;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return migrateState(JSON.parse(saved));
  } catch {
    /* localStorage unavailable */
  }
  return {
    tasks: [],
    collections: [],
    moodImages: [],
    theme: "light",
    collectionFilter: null,
  };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage unavailable */
  }
}

function reducer(state, action) {
  switch (action.type) {
    // ── Tasks ──
    case "ADD_TASK": {
      const { collectionId, ...rest } = action.payload;
      const task = {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        priority: "low",
        completed: false,
        status: "todo",
        collectionId: collectionId || null,
        dueDate: null,
        createdAt: Date.now(),
        order: state.tasks.length,
        images: [],
        ...rest,
      };
      return { ...state, tasks: [...state.tasks, task] };
    }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };
    case "REORDER_TASKS":
      return { ...state, tasks: action.payload };

    // ── Collections ──
    case "ADD_COLLECTION":
      return {
        ...state,
        collections: [
          ...state.collections,
          { id: crypto.randomUUID(), name: "New Collection", color: "#8B5CF6", createdAt: Date.now(), ...action.payload },
        ],
      };
    case "UPDATE_COLLECTION":
      return {
        ...state,
        collections: state.collections.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };
    case "DELETE_COLLECTION":
      return {
        ...state,
        collections: state.collections.filter((c) => c.id !== action.payload),
        tasks: state.tasks.map((t) =>
          t.collectionId === action.payload ? { ...t, collectionId: null } : t
        ),
      };

    // ── Mood Images ──
    case "ADD_MOOD_IMAGE":
      return {
        ...state,
        moodImages: [
          ...state.moodImages,
          { id: crypto.randomUUID(), url: "", title: "", x: 0, y: 0, width: 240, height: 180, zIndex: 0, createdAt: Date.now(), ...action.payload },
        ],
      };
    case "UPDATE_MOOD_IMAGE":
      return {
        ...state,
        moodImages: state.moodImages.map((img) =>
          img.id === action.payload.id ? { ...img, ...action.payload } : img
        ),
      };
    case "DELETE_MOOD_IMAGE":
      return {
        ...state,
        moodImages: state.moodImages.filter((img) => img.id !== action.payload),
      };

    // ── UI / Theme ──
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_COLLECTION_FILTER":
      return { ...state, collectionFilter: action.payload };
    case "CLEAR_COLLECTION_FILTER":
      return { ...state, collectionFilter: null };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  /* Sync theme to <html> element */
  useEffect(() => {
    const root = document.documentElement;
    const isDark = state.theme === "dark" || state.theme === "deep-purple" || state.theme === "emerald";
    root.classList.toggle("dark", isDark);
    root.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addTask = useCallback(
    (data) => dispatch({ type: "ADD_TASK", payload: data }), []
  );
  const updateTask = useCallback(
    (data) => dispatch({ type: "UPDATE_TASK", payload: data }), []
  );
  const deleteTask = useCallback(
    (id) => dispatch({ type: "DELETE_TASK", payload: id }), []
  );
  const toggleTask = useCallback(
    (id) => dispatch({ type: "TOGGLE_TASK", payload: id }), []
  );
  const reorderTasks = useCallback(
    (tasks) => dispatch({ type: "REORDER_TASKS", payload: tasks }), []
  );

  const addCollection = useCallback(
    (data) => dispatch({ type: "ADD_COLLECTION", payload: data }), []
  );
  const updateCollection = useCallback(
    (data) => dispatch({ type: "UPDATE_COLLECTION", payload: data }), []
  );
  const deleteCollection = useCallback(
    (id) => dispatch({ type: "DELETE_COLLECTION", payload: id }), []
  );

  const addMoodImage = useCallback(
    (data) => dispatch({ type: "ADD_MOOD_IMAGE", payload: data }), []
  );
  const updateMoodImage = useCallback(
    (data) => dispatch({ type: "UPDATE_MOOD_IMAGE", payload: data }), []
  );
  const deleteMoodImage = useCallback(
    (id) => dispatch({ type: "DELETE_MOOD_IMAGE", payload: id }), []
  );

  const setTheme = useCallback(
    (t) => dispatch({ type: "SET_THEME", payload: t }), []
  );
  const setCollectionFilter = useCallback(
    (id) => dispatch({ type: "SET_COLLECTION_FILTER", payload: id }), []
  );
  const clearCollectionFilter = useCallback(
    () => dispatch({ type: "CLEAR_COLLECTION_FILTER" }), []
  );

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
    addCollection,
    updateCollection,
    deleteCollection,
    addMoodImage,
    updateMoodImage,
    deleteMoodImage,
    setTheme,
    setCollectionFilter,
    clearCollectionFilter,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
