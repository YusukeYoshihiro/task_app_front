/* authSlice.ts */
  // AUTH_STATE,
  // CRED,
  // LOGIN_USER,
  // POST_PROFILE,
  // PROFILE,
  // JWT,
  // USER,
// Djangoのbackendのapi/urls.pyで作成した'loginuser/'にアクセスする時、
// ログイン指定しているアカウントの’id’,’username’が取得できる。
// その時のfront側でのデータを格納するための型（type）指定をここで行う。
export interface LOGIN_USER {
  id: number;
  username: string;
}

export interface FILE extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
// ｀urls.py｀における｀profile｀endpointにGETでアクセスした時に ProfileSerializerで設定した
// `fields = ['id', 'user_profile', 'img']`の内容が取得でき、Frontend側でデータを格納するときの型付けを指定
export interface PROFILE {
  id: number;
  user_profile: number;
  img: string | null;
}

export interface POST_PROFILE {
  id: number;
  img: File | null
}
// CRED => クレデンシャル 【credential】
// 情報セキュリティの分野では、認証などに用いられるID、ユーザー名、暗証番号、パスワード、生体パターンなどの識別情報の総称を指す。
export interface CRED {
  username: string;
  password: string; 
}

// authen/jwt/create でアクセスした時に返り値として｀refresh｀,`access`が帰ってくるため、
// Frontend側でrefresh｀,`access`の型付けを指定。
export interface JWT {
  refresh: string;
  access: string;
}

export interface USER {
  id: number;
  username: string;
}
// Redux Tool-kitで管理するstate
export interface AUTH_STATE {
  isLoginView: boolean;
  loginUser: LOGIN_USER;
  profiles: PROFILE[];
}



