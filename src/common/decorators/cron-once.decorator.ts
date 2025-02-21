import cluster from 'node:cluster'

import { Cron } from '@nestjs/schedule'

import { isMainProcess } from '~/global/env'

/* 整体逻辑
如果当前进程是主进程（isMainProcess 为 true），则执行定时任务。
如果当前进程是 cluster 模式下的 Worker 进程，并且是第一个 Worker（cluster.worker.id === 1），则执行定时任务。
否则，返回一个空的装饰器（returnNothing），即不执行定时任务。
*/
export const CronOnce: typeof Cron = (...rest): MethodDecorator => {
  // If not in cluster mode, and PM2 main worker
  // 如果当前是主进程
  if (isMainProcess)
    // 调用原始的 Cron 装饰器
    // eslint-disable-next-line no-useless-call
    return Cron.call(null, ...rest)

  // 如果当前是 cluster 模式下的第一个 Worker 进程
  if (cluster.isWorker && cluster.worker?.id === 1)
    // eslint-disable-next-line no-useless-call
    // 调用原始的 Cron 装饰器
    return Cron.call(null, ...rest)
  // 如果不是主进程或第一个 Worker 进程，返回一个空的装饰器
  const returnNothing: MethodDecorator = () => { }
  return returnNothing
}
