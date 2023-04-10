import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * Pulls the directory name off the url provided
 * @param url Usually import.meta.url
 * @returns
 */
export function getTestName(url: string) {
  const name = dirname(fileURLToPath(url));
  return name;
}
