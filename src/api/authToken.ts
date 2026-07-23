const TOKEN_KEY = "vms_token";

let currentToken: string | null = localStorage.getItem(TOKEN_KEY);
let unauthorizedHandler: (() => void) | null = null;

export function getToken(): string | null {
  return currentToken;
}

export function setToken(token: string | null) {
  currentToken = token;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// AuthContext đăng ký hàm này để tự động đăng xuất khi API trả về 401
// (token hết hạn hoặc bị thu hồi), không phải để gọi trực tiếp từ nơi khác.
export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized() {
  unauthorizedHandler?.();
}
