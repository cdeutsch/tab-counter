export const delay = async (timeoutMs: number): Promise<void> => {
  return new Promise((resolve) => {
    // tslint:disable-next-line: no-string-based-set-timeout
    setTimeout(resolve, timeoutMs);
  });
};

export const formatDate = (): string => {
  return new Intl.DateTimeFormat('default', {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date());
};
