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
      credentials: 'include', // penting untuk cookie (kalau backend set cookie juga)
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json(); // ini berisi { message, token, user }

    if (!res.ok) {
      return {
        success: false,
        message: result.message || 'Login gagal',
      };
    }

    return {
      success: true,
      message: result.message,
      data: {
        token: result.token,
        user: result.user,
      },
    };
  } catch {
    return {
      success: false,
      message: 'Terjadi kesalahan saat login',
    };
  }
}
