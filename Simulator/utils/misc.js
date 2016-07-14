export function cleanUrl(url) {
  const regex = /^http|^https|^\/|^\.\/|^\.\.\//i;
  return regex.test(url) ? url : `http://${url}`;
}
