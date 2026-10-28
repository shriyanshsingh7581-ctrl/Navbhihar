export function formatHindiDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'अभी-अभी';
    return new Intl.DateTimeFormat('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'आज';
  }
}

export function formatRelativeHindiTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'अभी-अभी';
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 5) return 'अभी-अभी';
    if (diffMins < 60) return `${diffMins} मिनट पहले`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays <= 7) return `${diffDays} दिन पहले`;
    return formatHindiDate(isoString);
  } catch {
    return 'आज';
  }
}

export function getTodayHindiHeaderDate(): string {
  try {
    return new Intl.DateTimeFormat('hi-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  } catch {
    return 'बुधवार, 28 अक्टूबर 2026';
  }
}
