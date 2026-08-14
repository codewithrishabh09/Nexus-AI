const DEFAULT_LOCAL_API = 'http://localhost:5000';

const isIpAddress = (value) =>
  /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?$/.test(value);

const isPrivateLanHost = (hostname) =>
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname.startsWith('192.168.') ||
  hostname.startsWith('10.') ||
  hostname.startsWith('172.16.') ||
  hostname.startsWith('172.17.') ||
  hostname.startsWith('172.18.') ||
  hostname.startsWith('172.19.') ||
  hostname.startsWith('172.2') ||
  hostname.startsWith('172.30.') ||
  hostname.startsWith('172.31.');

export const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, '');

  const { protocol, hostname, port } = window.location;
  const isSecure = protocol === 'https:';
  const currentPort = port && port !== '80' && port !== '443' ? `:${port}` : '';

  if (isPrivateLanHost(hostname) || isIpAddress(hostname)) {
    return `${protocol}//${hostname}${currentPort || ':5000'}`.replace(/:5173$/, ':5000');
  }

  return isSecure ? DEFAULT_LOCAL_API : DEFAULT_LOCAL_API;
};

