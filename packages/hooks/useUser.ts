import { BASE_URL } from '@/constants/api';

const getUserData = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${id}`, {
      next: { revalidate: 10 },
      headers: {
        'cloudflare-secret': process.env.CLOUDFLARE_SECRET!,
      },
    });
    const userData = await response.json();
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      return {
        response: {
          data: null,
          status: 500,
          statusText: error.message,
        },
      };
    }
    return {
      response: {
        data: null,
        status: 500,
        statusText: 'Internal server error',
      },
    };
  }
};

export { getUserData };
