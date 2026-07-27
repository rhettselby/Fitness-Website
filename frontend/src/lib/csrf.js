export function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name)
            return decodeURIComponent(value);
    }
    return null;
}
