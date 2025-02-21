import { Transform } from 'class-transformer'
import { castArray, isArray, isNil, trim } from 'lodash'

/**
 * 转换string 为 number
 */
export function ToNumber(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string[] | string

      if (isArray(value))
        return value.map(v => Number(v))

      return Number(value)
    },
    { toClassOnly: true },
  )
}

/**
 * 转换string 为 int
 */
export function ToInt(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string[] | string

      if (isArray(value))
        return value.map(v => Number.parseInt(v))

      return Number.parseInt(value)
    },
    { toClassOnly: true },
  )
}

/**
 * 转换string 为 boolean
 */
export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params) => {
      switch (params.value) {
        case 'true':
          return true
        case 'false':
          return false
        default:
          return params.value
      }
    },
    { toClassOnly: true },
  )
}

/**
 * 转换string 为 date
 */
export function ToDate(): PropertyDecorator {
  return Transform(
    (params) => {
      const { value } = params

      if (!value)
        return

      return new Date(value)
    },
    { toClassOnly: true },
  )
}

/**
 * 转换为数组，特别是对于查询参数
 */
export function ToArray(): PropertyDecorator {
  return Transform(
    (params) => {
      const { value } = params

      if (isNil(value))
        return []

      return castArray(value)
    },
    { toClassOnly: true },
  )
}

/**
 * 可作用与数组 或者 字符串， 去掉空格
 */
export function ToTrim(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string[] | string

      if (isArray(value))
        return value.map(v => trim(v))

      return trim(value)
    },
    { toClassOnly: true },
  )
}

/**
 * 作用域字符串 或者 数组，转为小写
 */
export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string[] | string

      if (!value)
        return

      if (isArray(value))
        return value.map(v => v.toLowerCase())

      return value.toLowerCase()
    },
    { toClassOnly: true },
  )
}

/**
 * 作用域字符串 或者 数组，转为大写
 */
export function ToUpperCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string[] | string

      if (!value)
        return

      if (isArray(value))
        return value.map(v => v.toUpperCase())

      return value.toUpperCase()
    },
    { toClassOnly: true },
  )
}
