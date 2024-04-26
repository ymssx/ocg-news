import Cookie from 'js-cookie';

export function getAuth() {
  const name = Cookie.get('GITHUB_NAME');
  const token = Cookie.get('GITHUB_TOKEN');
  return {
    name,
    token,
  };
}

export function hasAuth() {
  const auth = getAuth();
  return auth.name && auth.token;
}

export function setAuth(name: string, token: string) {
  Cookie.set('GITHUB_NAME', name);
  Cookie.set('GITHUB_TOKEN', token);
}