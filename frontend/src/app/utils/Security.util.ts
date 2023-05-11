import { User } from "../models/user.model";

export class Security {
  public static set(user: User, token: string) {
    const data = JSON.stringify(user);

    localStorage.setItem('wrconexao', btoa(data));
    localStorage.setItem('wrconexaoToken', token);
  }

  public static setUser(user: User) {
    const data = JSON.stringify(user);
    localStorage.setItem('wrconexao', btoa(data));
  }

  public static setToken(token: string) {
    localStorage.setItem('wrconexaoToken', token);
  }

  public static getUser(): User {
    const data = localStorage.getItem('wrconexao');
    if (data) {
      return JSON.parse(atob(data));
    } else {
      return null as any;
    }
  }

  public static getToken(): string {
    const data = localStorage.getItem('wrconexaoToken');
    if (data) {
      return data;
    } else {
      return null as any;
    }
  }

  public static hasToken(): boolean {
    if (this.getToken())
      return true;
    else
      return false;
  }

  public static clear() {
    localStorage.removeItem('wrconexao');
    localStorage.removeItem('wrconexaoToken');
  }
}
