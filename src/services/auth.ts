interface authProps {
  login: string;
  password: string;
}

export const auth = async ({ login, password }: authProps) => {
  const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    throw new Error(response.status === 401 ? 'Unauthorized' : 'Server error');
  }

  return await response.json();
};