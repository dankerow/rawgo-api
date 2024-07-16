import 'dotenv/config'

import type { Worker } from 'node:cluster'

import cluster from 'node:cluster'
import os from 'node:os'

import { consola } from 'consola'
import { setupGlobalConsole } from '@/utils/console'

interface WorkerMessage {
  type: string
  content: string
}

setupGlobalConsole({ dev: process.env.NODE_ENV === 'development' })

const workers: Map<number, Worker> = new Map()
const workersLength: number = (process.env.WORKERS_NUMBER ? parseInt(process.env.WORKERS_NUMBER) : false) || os.cpus().length

consola.withTag('Cluster').start(`Setting up ${workersLength} workers.`)

cluster.setupPrimary()

for (let i = 0; i < workersLength; i++) {
  const worker: Worker = cluster.fork()
  workers.set(worker.id, worker)
}

cluster.on('message', (worker, message: WorkerMessage) => {
  if (message.type) {
    switch (message.type) {
      case 'log':
        consola.withTag(`Worker #${worker.id}`).info(message.content)
        break
      case 'ready':
        consola.withTag(`Worker #${worker.id}`).ready(message.content)
        break
      case 'debug':
        consola.withTag(`Worker #${worker.id}`).debug(message.content)
        break
      case 'warn':
        consola.withTag(`Worker #${worker.id}`).warn(message.content)
        break
      case 'error':
        consola.withTag(`Worker #${worker.id}`).error(message.content)
        break
    }
  }
})

cluster.on('online', (worker) => {
  consola.withTag('Cluster').info(`Worker #${worker.id} is online`)
})

cluster.on('disconnect', (worker) => {
  consola.withTag('Cluster').warn(`Worker ${worker.id} disconnected`)
})

cluster.on('exit', (worker, code, signal) => {
  consola.withTag(`Worker #${worker.id}`).log( `died with code: ${code} and signal: ${signal}`)
  consola.withTag('Cluster').log( 'Starting a new worker')

  const newWorker: Worker = cluster.fork()
  workers.delete(worker.id)
  workers.set(newWorker.id, newWorker)
})
