// Глобальные константы и справочники

export const AUTH_KEY = 'smartech_admin_auth_v1'
export const LOCK_KEY = 'smartech_admin_lock_v1'
// ВНИМАНИЕ: хранить пароль в коде небезопасно. Для локальной админки ок.
export const ADMIN_PASSWORD = 'smartech2025'
// Ограничение на подбор
export const MAX_ATTEMPTS = 5
export const LOCK_MINUTES = 10

export const CATEGORIES = [
  { value: 'building', label: 'Building materials' },
  { value: 'ppe', label: 'PPE (Personal Protective Equipment)' },
]
