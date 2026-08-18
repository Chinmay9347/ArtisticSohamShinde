const DB_NAME = "artistic-soham-local-v249";
const STORE_NAME = "commission-drafts";
const DB_VERSION = 1;
const DEFAULT_DRAFT_SCOPE = "guest";

function getScopeKey(scope?: string) {
  const safe = String(scope || DEFAULT_DRAFT_SCOPE).replace(/[^a-zA-Z0-9_-]/g, "_");
  return `draft:${safe}`;
}

export interface StoredCommissionDraft<T> {
  formData: T;
  savedAt: number;
  currentStep: number;
}

function isBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB is unavailable."));
      return;
    }

    const request = window.indexedDB.open(
      DB_NAME,
      DB_VERSION,
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("Unable to open local draft storage."),
      );
  });
}

export async function saveCommissionDraft<T>(
  formData: T,
  currentStep: number,
  scope?: string,
) {
  if (!isBrowser()) return;

  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      "readwrite",
    );

    transaction.objectStore(STORE_NAME).put(
      {
        formData,
        currentStep,
        savedAt: Date.now(),
      } satisfies StoredCommissionDraft<T>,
      getScopeKey(scope),
    );

    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(
        transaction.error ??
          new Error("Unable to save commission draft."),
      );
  });

  database.close();
}

export async function loadCommissionDraft<T>(scope?: string): Promise<
  StoredCommissionDraft<T> | null
> {
  if (!isBrowser()) return null;

  const database = await openDatabase();

  const result = await new Promise<
    StoredCommissionDraft<T> | null
  >((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .get(getScopeKey(scope));

    request.onsuccess = () =>
      resolve(
        (request.result as StoredCommissionDraft<T> | undefined) ??
          null,
      );

    request.onerror = () =>
      reject(
        request.error ??
          new Error("Unable to load commission draft."),
      );
  });

  database.close();

  return result;
}

export async function clearCommissionDraft(scope?: string) {
  if (!isBrowser()) return;

  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      "readwrite",
    );

    transaction.objectStore(STORE_NAME).delete(getScopeKey(scope));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(
        transaction.error ??
          new Error("Unable to clear commission draft."),
      );
  });

  database.close();
}
