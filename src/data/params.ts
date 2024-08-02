/**
 * This file contains parameters interfaces,
 * which are handy for doing mapping and validation.
 */

// Feed Params.
export interface FeedParams {
  location?: string
  distance?: string | number
  metric?: string | 'km' | 'mi'
};

// Like Params.
export interface LikeParams {
  likerId: string | number
  likedId: string | number
  action: string | number
};

// Unlike Params.
export interface UnlikeParams {
  likerId: string | number
  likedId: string | number
};
