const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'user';
export const TokenService = {
    getAccessToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    getRefreshToken() {
        return localStorage.getItem(REFRESH_KEY);
    },
    setTokens(access, refresh) {
        localStorage.setItem(TOKEN_KEY, access);
        localStorage.setItem(REFRESH_KEY, refresh);
    },
    removeTokens() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
    },
    getUser() {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
};
