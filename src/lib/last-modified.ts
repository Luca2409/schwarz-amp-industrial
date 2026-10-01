import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

/**
 * Determines when a page last changed, based on its source files. Per file it uses the
 * date of the last git commit touching it, or the file's modification time if the file
 * was never committed. The result feeds `og:updated_time` and the sitemap's `lastmod`.
 *
 * Needs the full git history in CI (`fetch-depth: 0` in `.github/workflows/deploy.yml`);
 * a shallow clone would give every file the date of the latest commit.
 *
 * @param files Source file paths relative to the project root, e.g. `entry.filePath`.
 *   `undefined` values are ignored.
 * @returns The latest date across all files, or `undefined` if none could be determined.
 */
export function getLastModified(...files: (string | undefined)[]): Date | undefined {
  const dates = files.filter((file): file is string => !!file).map((file) => {
    try {
      const committed = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf-8' }).trim();
      if (committed) return new Date(committed);
    } catch {}
    return fs.existsSync(file) ? fs.statSync(file).mtime : undefined;
  });

  const times = dates.filter((date): date is Date => !!date).map((date) => date.getTime());
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}
