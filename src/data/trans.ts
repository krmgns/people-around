/**
 * This file contains Data Transfer Objects,
 * which are handy for doing mapping and validation.
 */

// User Login DTO.
export interface UserLoginDTO {
  email: string
  password: string
};

// User Logout DTO.
export interface UserLogoutDTO {
  email: string
};

// User Register DTO.
export interface UserRegisterDTO {
  name: string
  email: string
  password: string
  bio?: string
  latitude?: number
  longitude?: number
};

// User Update DTO.
export interface UserUpdateDTO extends UserRegisterDTO {
  id: number
}

// Like/Unlike DTO.
export interface LikeDTO {
  likerId: number
  likedId: number
  action?: 1 | 0
}
