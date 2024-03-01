import config from '../config';

export const handleAuthorization = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    const query = {
        email: userInfo.email,
        refreshToken: userInfo.refreshToken
    }
    const response = await fetch(
        `${config.server.host}v1/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            body: JSON.stringify(query),
          },
        }
    );
    userInfo.accessToken = response.accessToken;
    userInfo.refreshToken = response.refreshToken;
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    window.location.reload();
}