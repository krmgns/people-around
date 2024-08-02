/**
 * This file contains model classes.
 * As these classes only provide validations,
 * they can be consired NOT real model classes.
 */

import { UserLoginDTO, UserLogoutDTO, UserRegisterDTO, UserUpdateDTO, LikeDTO } from './trans';
import { LikeParams, UnlikeParams } from './params';
import { validateLatitude, validateLongitude } from './utils';

/**
 * Base model class.
 */
abstract class Model {
  protected data: object;

  constructor(data: object, trim: boolean = true) {
    if (trim) for (let name in data) {
      if (typeof data[name] === 'string') {
        data[name] = data[name].trim();
      }
    }

    this.data = data;
  }

  abstract getData(): object;
  abstract validateData(): boolean;
}

export class UserLoginModel extends Model {
  constructor(params: UserLoginDTO) {
    super(params);
  }

  getData(): UserLoginDTO {
    return this.data as UserLoginDTO;
  }

  validateData(): boolean {
    const { email, password } = this.getData();

    if (!email || !password) {
      return false;
    }

    return true;
  }
}
export class UserLogoutModel extends Model {
  constructor(params: UserLogoutDTO) {
    super(params);
  }

  getData(): UserLogoutDTO {
    return this.data as UserLogoutDTO;
  }

  validateData(): boolean {
    const { email } = this.getData();

    if (!email) {
      return false;
    }

    return true;
  }
}

/**
 * Model for user registerations with validations.
 */
export class UserRegisterModel extends Model {
  constructor(data: UserRegisterDTO) {
    super(data);

    if ('latitude' in this.data) {
      this.data.latitude = Number(this.data.latitude);
    }
    if ('longitude' in this.data) {
      this.data.longitude = Number(this.data.longitude);
    }
  }

  getData(): UserRegisterDTO {
    return this.data as UserRegisterDTO;
  }

  validateData(): boolean {
    const { name, email, password, latitude, longitude } = this.getData();

    // Required fields.
    if (!name || !email || !password) {
      return false;
    }

    if (latitude && !validateLatitude(latitude)) {
      return false;
    }
    if (longitude && !validateLongitude(longitude)) {
      return false;
    }

    return true;
  }
}

/**
 * Model for user updates with validations.
 */
export class UserUpdateModel extends UserRegisterModel {
  override getData(): UserUpdateDTO {
    return this.data as UserUpdateDTO;
  }

  override validateData(): boolean {
    const { id, name, latitude, longitude } = this.getData();

    // Required fields.
    if (!id || !name) {
      return false;
    }

    if (latitude && !validateLatitude(latitude)) {
      return false;
    }
    if (longitude && !validateLatitude(longitude)) {
      return false;
    }

    return true;
  }
}

/**
 * Model for like / unlike with validations.
 */
export class LikeModel extends Model {
  constructor(params: LikeParams | UnlikeParams) {
    for (let name in params) {
      params[name] = Number(params[name]);
    }

    super(params, false);
  }

  getData(): LikeDTO {
    return this.data as LikeDTO;
  }

  // Not in use (breaks LSP, yes).
  validateData(): boolean {
    return true;
  }

  validateLikeData(): boolean {
    const { likerId, likedId, action } = this.getData();

    if (!likerId || !likedId) {
      return false;
    }
    if (action !== 1 && action !== 0) {
      return false;
    }

    return true;
  }

  validateUnlikeData(): boolean {
    const { likerId, likedId } = this.getData();

    if (!likerId || !likedId) {
      return false;
    }

    return true;
  }
}
