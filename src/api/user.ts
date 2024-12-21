import { loginRSA } from '/@/config'
import { encryptedData } from '/@/utils/encrypt'
import request from '/@/utils/request_xyt.ts'

interface FormType {
  password: string
  password2?: string
  phone: string
  phoneCode: string
  username: string
  verificationCode: string
}

export const login = async (data: any) => {
  if (loginRSA) data = { ...data, password: await encryptedData(data) }
  // console.log('before login data ',data)
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export const getUserInfo = () => {
  return request({
    url: '/user/userInfo',
    method: 'get',
  })
}

export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'get',
  })
}

export const register = (data: FormType) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  })
}

export const password = (data: FormType) => {
  return request({
    url: '/password',
    method: 'post',
    data,
  })
}

export const lock = () => {
  return request({
    url: '/lock',
    method: 'get',
  })
}
