/**
 * Tipos de Perfil e Usuário (domain: Profile/Users)
 */

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: string
  role: 'CLIENT' | 'ADMIN'
  createdAt?: string
  updatedAt?: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
