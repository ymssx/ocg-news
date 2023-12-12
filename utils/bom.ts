export function onlyBrowser(callback: () => unknown, defaultData?: any) {
  if (typeof window !== 'undefined') {
    return callback();
  }
  return defaultData || '';
}

export function isMobileDevice() {
  // eslint-disable-next-line max-len
  return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
    window.navigator.userAgent
  );
}