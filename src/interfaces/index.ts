// サインアップ
export interface SignUpData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

// サインイン
export interface SignInData {
  email: string
  password: string
}
