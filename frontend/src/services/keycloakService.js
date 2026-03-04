import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
})

export async function initKeycloak() {
  if (keycloak.didInitialize) {
    return keycloak.authenticated
  }

  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
      redirectUri: window.location.origin + '/',
    })

    if (authenticated) {
      console.log('Current user info:', keycloak.tokenParsed)
    }

    return authenticated
  } catch (err) {
    console.error('Keycloak init failed', err)
    return false
  }
}

export function getUser() {
  return keycloak.tokenParsed ?? null
}

export function login() {
  keycloak.login()
}

export function logout() {
  keycloak.logout({ redirectUri: window.location.origin + '/' })
}

export function getToken() {
  return keycloak.token
}

export async function refreshToken(minValidity = 30) {
  await keycloak.updateToken(minValidity)
  return keycloak.token
}

export default keycloak