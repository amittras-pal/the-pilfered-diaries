import { StorageError } from "firebase/storage";

export const slugify = (e: React.ChangeEvent<HTMLInputElement>) => {
  return e.target.value.trim().replace(/\s/g, "-").toLowerCase();
};

// TODO: do the appropriate error handling here.
export function handleFSError(error: StorageError) {
  console.log(error.code);
  console.log(error.cause);
}
