import axios, { Axios } from "axios";

export interface LoginFormValues {
  username: string;
  password: string;
}

class AuthService {
  private readonly axios: Axios;

  constructor() {
    this.axios = axios.create({
      baseURL: `https://bytcsdy3m8.execute-api.us-east-2.amazonaws.com/prod`
    });
  }

  async login(body: LoginFormValues): Promise<void> {
    const { data } = await this.axios.post<{ token: string }>("/auth", body);

    if (!data.token) {
      throw new Error("No token received");
    }

    localStorage.setItem("token", data.token);
  }

  async signUp(body: LoginFormValues): Promise<void> {
    await this.axios.post("/register", body);
    await this.login(body);
  }
}
export const authService = new AuthService();
