const DEFAULT_USER = {
  _id: 'user-static-1',
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '+923001234567',
  role: { role_name: 'Admin' },
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=10b981&color=fff',
};

const STATIC_ROLES = [
  { _id: 'admin', role_name: 'Admin' },
  { _id: 'manager', role_name: 'Manager' },
  { _id: 'sales', role_name: 'Sales' },
];

const saveUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'static-token');
  }
};

export const AuthService = {
  async signup(data: { name: string; email: string; password: string; phone?: string; role: string; avatar?: string | null }) {
    const user = {
      ...DEFAULT_USER,
      _id: `user-${Date.now()}`,
      name: data.name || DEFAULT_USER.name,
      email: data.email || DEFAULT_USER.email,
      phone: data.phone || DEFAULT_USER.phone,
      role: { role_name: data.role || DEFAULT_USER.role.role_name },
      avatar: data.avatar || DEFAULT_USER.avatar,
    };

    saveUser(user);
    return { token: 'static-token', user };
  },

  async login(email: string, password: string) {
    const user = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      role: { role_name: 'Admin' },
    };

    saveUser(user);
    return { token: 'static-token', user };
  },

  async getAvailableRoles() {
    return STATIC_ROLES;
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated() {
    return true;
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || 'static-token';
    }
    return 'static-token';
  },

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : DEFAULT_USER;
    }
    return DEFAULT_USER;
  },

  setAuthData(token: string, user: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  async getCurrentUser(): Promise<any> {
    return { user: this.getUser() };
  },
};

