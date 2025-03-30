export interface JwtResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

export interface JwtPayload {
  sub: string;      // username
  iat: number;      // issued at timestamp
  exp: number;      // expiration timestamp
  [key: string]: any; // altri campi
}
