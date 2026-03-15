export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  tokenAllowedDomains: [/localhost:8080/],
  tokenDisallowedRoutes: [/\/oauth2\/token/],
  oauthCallbackUrl: 'http://local-plataforma.com:4200/authorized',
  logoutRedirectToUrl: 'http://local-plataforma.com:4200',
  oauth: {
    clientId: 'plataformaweb',
    scope: 'READ WRITE',
    basicAuthToken: 'Basic cGxhdGFmb3JtYXdlYjoxMjM=',
  },
};
