import Cookies from 'js-cookie';

export async function login(email: string, password: string): Promise<{
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || 'Login gagal',
      };
    }

    const { token, user } = result;

    // ✅ Simpan ke localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // ✅ Simpan ke cookie (bisa diakses client-side)
    Cookies.set('token', token, { expires: 7 }); // 7 hari
    Cookies.set('user', JSON.stringify(user), { expires: 7 });

    return {
      success: true,
      message: result.message,
      data: {
        token,
        user,
      },
    };
  } catch {
    return {
      success: false,
      message: 'Terjadi kesalahan saat login',
    };
  }
}
