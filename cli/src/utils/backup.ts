import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export interface BackupOptions {
  suffix?: string;
  directory?: string;
  maxBackups?: number;
}

export async function createBackup(
  filePath: string,
  options: BackupOptions = {},
): Promise<string> {
  const {
    suffix = `.backup.${Date.now()}`,
    directory,
    maxBackups = 10,
  } = options;

  try {
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    const backupDir = directory || path.join(fileDir, ".neurolint-backups");

    // Ensure backup directory exists
    await fs.ensureDir(backupDir);

    // Generate backup file path
    const backupFileName = `${fileName}${suffix}`;
    const backupPath = path.join(backupDir, backupFileName);

    // Copy original file to backup location
    await fs.copy(filePath, backupPath);

    // Clean up old backups if necessary
    await cleanupOldBackups(backupDir, fileName, maxBackups);

    return backupPath;
  } catch (error) {
    throw new Error(
      `Failed to create backup for ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function restoreBackup(
  backupPath: string,
  targetPath?: string,
): Promise<void> {
  try {
    const target = targetPath || backupPath.replace(/\.backup\.\d+$/, "");
    await fs.copy(backupPath, target);
  } catch (error) {
    throw new Error(
      `Failed to restore backup ${backupPath}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function listBackups(filePath: string): Promise<string[]> {
  try {
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    const backupDir = path.join(fileDir, ".neurolint-backups");

    if (!(await fs.pathExists(backupDir))) {
      return [];
    }

    const files = await fs.readdir(backupDir);
    return files
      .filter((file) => file.startsWith(fileName) && file.includes(".backup."))
      .map((file) => path.join(backupDir, file))
      .sort((a, b) => {
        // Sort by timestamp (newest first)
        const timestampA = extractTimestamp(a);
        const timestampB = extractTimestamp(b);
        return timestampB - timestampA;
      });
  } catch (error) {
    return [];
  }
}

export async function cleanupOldBackups(
  backupDir: string,
  originalFileName: string,
  maxBackups: number,
): Promise<void> {
  try {
    const files = await fs.readdir(backupDir);
    const backupFiles = files
      .filter(
        (file) =>
          file.startsWith(originalFileName) && file.includes(".backup."),
      )
      .map((file) => ({
        path: path.join(backupDir, file),
        timestamp: extractTimestamp(file),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    // Remove old backups beyond the limit
    if (backupFiles.length > maxBackups) {
      const filesToDelete = backupFiles.slice(maxBackups);
      await Promise.all(filesToDelete.map((file) => fs.remove(file.path)));
    }
  } catch (error) {
    // Ignore cleanup errors
    console.warn(
      chalk.yellow(
        `Warning: Failed to cleanup old backups: ${error instanceof Error ? error.message : "Unknown error"}`,
      ),
    );
  }
}

function extractTimestamp(filePath: string): number {
  const match = filePath.match(/\.backup\.(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export async function createBackupManager(options: BackupOptions = {}) {
  return {
    async backup(filePath: string): Promise<string> {
      return createBackup(filePath, options);
    },

    async restore(backupPath: string, targetPath?: string): Promise<void> {
      return restoreBackup(backupPath, targetPath);
    },

    async list(filePath: string): Promise<string[]> {
      return listBackups(filePath);
    },

    async cleanup(backupDir: string, originalFileName: string): Promise<void> {
      return cleanupOldBackups(
        backupDir,
        originalFileName,
        options.maxBackups || 10,
      );
    },
  };
}
