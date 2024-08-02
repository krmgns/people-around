## Description
People Around is a simple NestJS application to find people aroud you and send them likes and also dislikes.

After these first three steps, you can open [http://localhost:3000/feed](http://localhost:3000/feed) to see user list.

## Installation
    $ npm install

## Running
    $ npm run start

## Seeding
    $ npm run prisma:init
    $ npm run prisma:migrate
    $ npm run prisma:seed

## Testing
    $ npm run test:e2e

## RESTful API / Endpoints

### `GET /feed`
List all users, including their calculated distance as `_distance` field in the returning JSON response.

### Query Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| location | String? | - | Used as latitude/longitude coordinations to filter users in format of `latitude,longitude`. |
| distance | Integer? | 1 | Used as proximity value to compare `distance` value like `HAVING (_distance <= proximity)`. |
| metric | String? | km | Used as metric factor to calculate the distance. Valid values `km = 0.001` for kilometers, `mi = 0.000621371192` for miles. |

### Request
    GET /feed
    GET /feed?location=1.81912248,39.53409246
    GET /feed?location=1.81912248,39.53409246&distance=10
    GET /feed?location=1.81912248,39.53409246&distance=10&metric=mi

### Response (200)
```json
[
  {
    "id": 1,
    "name": "Ali",
    "email": "ali@baz.com",
    "bio": "Hello!",
    "latitude": 1.81912248,
    "longitude": 39.53409246,
    "createdAt": "2024-07-31T22:34:14.823Z",
    "updatedAt": "2024-08-02T01:31:13.931Z",
    "_distance": 0
  },
  ...
]
```

### Errors
`400 Bad Request`: If metric is not `km` or `mi`

## `GET /user/:id`
Fetch a single user profile by given ID.

### Path Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| id | Integer | - | The target user ID. |

### Request
    GET /user/1

### Response (200)
```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@baz.com",
  "bio": "Hello!",
  "latitude": 1.81912248,
  "longitude": 39.53409246,
  "createdAt": "2024-07-31T22:34:14.823Z",
  "updatedAt": "2024-08-02T12:41:58.258Z"
}
```

### Errors
`404 Not Found`: If user does not exist with given ID.

## `POST /user/:id/like`

Send a like or dislike for a user by given ID.

### Path Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| id | Integer | - | The target user ID. |
### Query Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| action | Integer | - | The action to apply, `1` as like and `0` as dislike. |

### Request
    POST /user/1/like?action=1
    POST /user/1/like?action=0

### Response (201)
```json
{
  "id": 123,
  "likerId": 1,
  "likedId": 2,
  "action": 1,
  "createdAt": "2024-08-02T13:06:02.003Z",
  "updatedAt": "2024-08-02T13:06:02.003Z"
}
```

### Errors
`400 Bad Request`: If user ID or action is not valid. <br>
`409 Conflict`: If user was liked / disliked already, depending on same action.

## `DELETE /user/:id/like`
Remove a like for a user by given ID.

### Path Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| id | Integer | - | The target user ID. |

### Request
    DELETE /user/1/like

### Response (200)
```json
{
  "id": 123,
  "likerId": 1,
  "likedId": 2,
  "action": 1,
  "createdAt": "2024-08-02T13:06:02.003Z",
  "updatedAt": "2024-08-02T13:06:02.003Z"
}
```

### Errors
`400 Bad Request`: If user ID is not valid. <br>
`404 Not Found`: If no like / dislike found that was sent before.

## `POST /user/login`
Log in as a user.

### Body Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| email | String | - | User email. |
| password | String | - | User password. |

### Request
```json
{
  "email": "ali@baz.com",
  "password": "123"
}
```

### Response (200)
```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@baz.com",
  "bio": "Dolor..",
  "latitude": 1.81912248,
  "longitude": 39.53409246,
  "createdAt": "2024-07-31T22:34:14.823Z",
  "updatedAt": "2024-07-31T22:34:14.823Z"
}
```

### Errors
`400 Bad Request`: If no valid email or password provided. <br>
`404 Not Found`: If no user found with given email. <br>
`401 Unauthorized`: If given password did not match.

## `POST /user/logout`
Log out as a user.

### Body Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| email | String | - | User email. |

### Request
```json
{
  "email": "ali@baz.com"
}
```

### Response (200)
```json
{
  "okay": true,
  "email": "ali@baz.com"
}
```

### Errors
`400 Bad Request`: If no valid email provided.

## `POST /user/register`
Register as a user.

### Body Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| name | String | - | User name. |
| email | String | - | User email. |
| password | String | - | User password. |
| bio | String? | - | User bio. |
| latitude | Float? | - | User latitude. |
| longitude | Float? | - | User longitude. |

### Request
```json
{
  "name": "Kerem",
  "email": "ben@kerem.com",
  "password": "123",
  "bio": "Hello, world!",
  "latitude": 1.234,
  "longitude": 1.234
}
```

### Response (201)
```json
{
  "id": 20,
  "name": "Kerem",
  "email": "ben@kerem.com",
  "bio": "Hello, world!",
  "latitude": 1.234,
  "longitude": 1.234,
  "createdAt": "2024-08-02T13:36:18.220Z",
  "updatedAt": "2024-08-02T13:36:18.220Z"
}
```

### Errors
`400 Bad Request`: If required fields not provided. <br>
`409 Conflict`: If email was taken already.

## `PUT /user/update`
Update as a user.

### Body Parameters
| Name | Type | Default | Description |
| -    | -    | -       | -           |
| id | Integer | - | User ID. |
| name | String | - | User name. |
| email | String? | - | User email. |
| password | String? | - | User password. |
| bio | String? | - | User bio. |
| latitude | Float? | - | User latitude. |
| longitude | Float? | - | User longitude. |

### Request
```json
{
  "id": 20,
  "name": "Kerem",
  "email": "ben@kerem.com",
  "password": "123",
  "bio": "Hello, world!",
  "latitude": 1.234,
  "longitude": 1.234
}
```

### Response (200)
```json
{
  "id": 20,
  "name": "Kerem",
  "email": "ben@kerem.com",
  "bio": "Hello, world!",
  "latitude": 1.234,
  "longitude": 1.234,
  "createdAt": "2024-08-02T13:36:18.220Z",
  "updatedAt": "2024-08-02T13:42:01.380Z"
}
```

### Errors
`400 Bad Request`: If required fields not provided. <br>
`404 Not Found`: If no user found by ID. <br>
`409 Conflict`: If email was taken already.
