import axios from "axios"


export async function verifyCaptchaUsingToken (token: string) : Promise<void> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    throw new Error('RECAPTCHA_SECRET_KEY is not defined');
  }
  if (!token) {
    throw new Error('Token is not defined');
  }

  const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token
    }
  });

  const data = response.data;
  if (!data.success) {
    if (data['error-codes'].includes('missing-input-secret')) {
      throw new Error('RECAPTCHA_SECRET_KEY가 없습니다.');
    }

    if (data['error-codes'].includes('invalid-input-secret')) {
      throw new Error('RECAPTCHA_SECRET_KEY가 잘못되었거나 유효하지 않습니다.');
    }

    if (data['error-codes'].includes('missing-input-response')) {
      throw new Error('토큰을 제출하지 않았습니다.');
    }

    if (data['error-codes'].includes('invalid-input-response')) {
      throw new Error('토큰이 잘못되었거나 유효하지 않습니다.');
    }

    if (data['error-codes'].includes('bad-request')) {
      throw new Error('요청이 잘못되었거나 유효하지 않습니다.');
    }

    if (data['error-codes'].includes('timeout-or-duplicate')) {
      throw new Error('응답이 더 이상 유효하지 않습니다: 너무 오래되었거나 이전에 사용되었습니다.');
    }

    throw new Error('알 수 없는 오류가 발생했습니다');
  } 
}