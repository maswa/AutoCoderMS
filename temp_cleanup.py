"""
Temp Cleanup Module
===================

Cleans up stale temporary files and directories created by AutoForge agents,
Playwright, Node.js, and other development tools.

Called at Maestro (orchestrator) startup to prevent temp folder bloat.

Why this exists:
- Playwright creates browser profiles and artifacts in %TEMP%
- Node.js creates .node cache files (~7MB each, can accumulate to GBs)
- MongoDB Memory Server downloads binaries to temp
- These are never cleaned up automatically

When cleanup runs:
- At Maestro startup (when you click Play or auto-restart after rate limits)
- Only files/folders older than 1 hour are deleted (safe for running processes)
"""

import logging
import shutil
import tempfile
import time
from pathlib import Path

logger = logging.getLogger(__name__)

# Max age in seconds before a temp item is considered stale (1 hour)
MAX_AGE_SECONDS = 3600

# Directory patterns to clean up (glob patterns)
DIR_PATTERNS = [
    "playwright_firefoxdev_profile-*",  # Playwright Firefox profiles
    "playwright-artifacts-*",           # Playwright test artifacts
    "playwright-transform-cache",       # Playwright transform cache
    "mongodb-memory-server*",           # MongoDB Memory Server binaries
    "ng-*",                             # Angular CLI temp directories
    "scoped_dir*",                      # Chrome/Chromium temp directories
]

# File patterns to clean up (glob patterns)
FILE_PATTERNS = [
    ".78912*.node",   # Node.js native module cache (major space consumer, ~7MB each)
    "claude-*-cwd",   # Claude CLI working directory temp files
    "mat-debug-*.log",  # Material/Angular debug logs
]


def cleanup_stale_temp(max_age_seconds: int = MAX_AGE_SECONDS) -> dict:
    """
    Clean up stale temporary files and directories.

    Only deletes items older than max_age_seconds to avoid
    interfering with currently running processes.

    Args:
        max_age_seconds: Maximum age in seconds before an item is deleted.
                        Defaults to 1 hour (3600 seconds).

    Returns:
        Dictionary with cleanup statistics:
        - dirs_deleted: Number of directories deleted
        - files_deleted: Number of files deleted
        - bytes_freed: Approximate bytes freed
        - errors: List of error messages (for debugging, not fatal)
    """
    temp_dir = Path(tempfile.gettempdir())
    cutoff_time = time.time() - max_age_seconds

    stats = {
        "dirs_deleted": 0,
        "files_deleted": 0,
        "bytes_freed": 0,
        "errors": [],
    }

    # Clean up directories
    for pattern in DIR_PATTERNS:
        for item in temp_dir.glob(pattern):
            if not item.is_dir():
                continue
            try:
                mtime = item.stat().st_mtime
                if mtime < cutoff_time:
                    size = _get_dir_size(item)
                    shutil.rmtree(item, ignore_errors=True)
                    if not item.exists():
                        stats["dirs_deleted"] += 1
                        stats["bytes_freed"] += size
                        logger.debug(f"Deleted temp directory: {item}")
            except Exception as e:
                stats["errors"].append(f"Failed to delete {item}: {e}")
                logger.debug(f"Failed to delete {item}: {e}")

    # Clean up files
    for pattern in FILE_PATTERNS:
        for item in temp_dir.glob(pattern):
            if not item.is_file():
                continue
            try:
                mtime = item.stat().st_mtime
                if mtime < cutoff_time:
                    size = item.stat().st_size
                    item.unlink(missing_ok=True)
                    if not item.exists():
                        stats["files_deleted"] += 1
                        stats["bytes_freed"] += size
                        logger.debug(f"Deleted temp file: {item}")
            except Exception as e:
                stats["errors"].append(f"Failed to delete {item}: {e}")
                logger.debug(f"Failed to delete {item}: {e}")

    # Log summary if anything was cleaned
    if stats["dirs_deleted"] > 0 or stats["files_deleted"] > 0:
        mb_freed = stats["bytes_freed"] / (1024 * 1024)
        logger.info(
            f"Temp cleanup: {stats['dirs_deleted']} dirs, "
            f"{stats['files_deleted']} files, {mb_freed:.1f} MB freed"
        )

    return stats


def _get_dir_size(path: Path) -> int:
    """Get total size of a directory in bytes."""
    total = 0
    try:
        for item in path.rglob("*"):
            if item.is_file():
                try:
                    total += item.stat().st_size
                except (OSError, PermissionError):
                    pass
    except (OSError, PermissionError):
        pass
    return total


if __name__ == "__main__":
    # Allow running directly for testing/manual cleanup
    logging.basicConfig(level=logging.DEBUG)
    print("Running temp cleanup...")
    stats = cleanup_stale_temp()
    mb_freed = stats["bytes_freed"] / (1024 * 1024)
    print(f"Cleanup complete: {stats['dirs_deleted']} dirs, {stats['files_deleted']} files, {mb_freed:.1f} MB freed")
    if stats["errors"]:
        print(f"Errors (non-fatal): {len(stats['errors'])}")
