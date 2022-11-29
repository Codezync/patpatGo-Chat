export interface loginUser{
  client_id: string,
  client_secret: string,
  grant_type: string,
  Username: string,
  Password: string
}

export interface AuthResponse {
  access_token:  string;
  expires_in:    any;
  token_type:    string;
  refresh_token: string;
  scope:         string;
  SessionId:     string;
}

export interface UserInfo {
  sub:                   string;
  website:               string;
  family_name:           string;
  given_name:            string;
  name:                  string;
  role:                  string[] | string;
  preferred_username:    string;
  email:                 string;
  email_verified:        boolean;
  phone_number:          string;
  phone_number_verified: boolean;
  JoinedDate:            string;
  profilePicture:        string;
  birthDay:              string;
  gender:                string;
}


export class UserAuth {
  constructor(
      private access_token: string,
      private expires_in: number,
      public token_type: string,
      private refresh_token: string,
      public scope: string,
      public SessionId: string
  ){}

  get accessToken() {
      if (!this.expires_in) {
          return null;
      }
      return this.access_token;
  }

  get refreshToken() {
      return this.refresh_token;
  }
}

export interface loginError{
  error: string;
  error_description: string;
}
