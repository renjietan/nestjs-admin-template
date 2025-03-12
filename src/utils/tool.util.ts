import { customAlphabet, nanoid } from 'nanoid'

import { md5 } from './crypto.util'
import { ValidationError } from 'class-validator'
import { FindManyOptions, FindOptionsWhere } from 'typeorm'
import { PagerDto } from '~/common/dto/pager.dto'
import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer'

export function getAvatar(mail: string | undefined) {
  if (!mail)
    return ''

  return `https://cravatar.cn/avatar/${md5(mail)}?d=retro`
}

export function generateUUID(size: number = 21): string {
  return nanoid(size)
}

export function generateShortUUID(): string {
  return nanoid(10)
}

/**
 * 生成一个随机的值
 */
export function generateRandomValue(
  length: number,
  placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
): string {
  const customNanoid = customAlphabet(placeholder, length)
  return customNanoid()
}

/**
 * 生成一个随机的值
 */
export function randomValue(
  size = 16,
  dict = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict',
): string {
  let id = ''
  let i = size
  const len = dict.length
  while (i--) id += dict[(Math.random() * len) | 0]
  return id
}

export const hashString = function (str, seed = 0) {
  let h1 = 0xDEADBEEF ^ seed
  let h2 = 0x41C6CE57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1
    = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
    ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2
    = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export const uniqueSlash = (path: string) => path.replace(/(https?:\/)|(\/)+/g, '$1$2')

/**
 * @path: src\main\nest\utils\index.ts
 * @functionName roundToNearest0025
 * @param {}
 * @description 俩个数字相除，以倍数作为基础四舍五入
 * @author 谭人杰
 * @date 2025-01-08 15:46:46
 */
export function b_diff(start: number, end: number, count: number, n: number) {
  const diff_total = end - start
  const increment = diff_total / count
  const roundedIncrement = Math.round(increment / n) * n
  return roundedIncrement
}



export const deepFindValidateError = (data: ValidationError[]) => {
  let errors = []
  const fun = (nodes: ValidationError[]) => {
    if (nodes.length == 0)
      return
    nodes.forEach((item) => {
      const constraints = Object.values(item?.constraints ?? {})
      const children = item?.children ?? []
      errors = [...errors, ...constraints]
      children.length > 0 && fun(children)
    })
  }
  fun(data)
  return errors
}

export function getQueryField<T> (searchOptions: T): {} {
  let _pagerDto = new PagerDto()
  let pager_json = instanceToPlain(_pagerDto)
  let query = {}
  for (const key in searchOptions) {
    query = {
      ...query,
      ...(!(key in pager_json) && { [key]: searchOptions[key]})
    }
  }
  return query
}


export function generateRandomString(length = 1) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export function toHexStringBy16Bit(str) {
  const code = str.charCodeAt(0)
  if (code < 16) {
    return `0${code.toString(16).toUpperCase()}`
  }
  else {
    return code.toString(16).toUpperCase()
  }
}

export function parseArrayToTree(data) {
  const map = new Map()
  data.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })
  const tree = []
  data.forEach((item) => {
    if (item.pId === 0) {
      tree.push(map.get(item.id))
    }
    else {
      const parent = map.get(item.pId)
      if (parent) {
        parent.children.push(map.get(item.id))
      }
    }
  })
  return tree
}