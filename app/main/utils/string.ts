export const extractPathFromURL = (url: string | URL) => {
  try {
    const urlObject = new URL(url);
    return urlObject.pathname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '/';
  }
}
