import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha() {
  return request('/auth/vCode', {
    method: 'GET',
  });
}
