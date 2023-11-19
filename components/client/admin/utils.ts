import { StorageError } from "firebase/storage";

export const slugify = (e: React.ChangeEvent<HTMLInputElement>) => {
  return e.currentTarget.value
    .trim()
    .replace(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .join("-")
    .toLowerCase();
};

// TODO: do the appropriate error handling here.
export function handleFSError(error: StorageError) {
  console.log(error.code);
  console.log(error.cause);
}
