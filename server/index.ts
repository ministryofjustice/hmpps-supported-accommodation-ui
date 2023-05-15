/* istanbul ignore file */

import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import createApp from './app'
import { controllers } from './controllers'
import { services } from './services'

promClient.collectDefaultMetrics()

const serviceList = services()
const app = createApp(controllers(serviceList), serviceList)
const metricsApp = createMetricsApp()

export { app, metricsApp }
