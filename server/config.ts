/* istanbul ignore file */

import { ServiceName } from './@types/shared/models/ServiceName'

const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
  serviceName?: ServiceName
}

export interface AuditConfig {
  region: string
  queueUrl: string
  serviceName: string
  logErrors: boolean
}

export default {
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  environment: process.env.ENVIRONMENT || 'local',
  sentry: {
    dsn: get('SENTRY_DSN', null, requiredInProduction),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    approvedPremises: {
      url: get('APPROVED_PREMISES_API_URL', 'http://localhost:9092', requiredInProduction),
      timeout: {
        response: Number(get('COMMUNITY_ACCOMMODATION_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('COMMUNITY_ACCOMMODATION_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('COMMUNITY_ACCOMMODATION_API_TIMEOUT_RESPONSE', 10000))),
      serviceName: get('COMMUNITY_ACCOMMODATION_API_SERVICE_NAME', 'approved-premises', requiredInProduction),
    },
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    audit: {
      region: get('AUDIT_SQS_REGION', 'eu-west-2'),
      queueUrl: get('AUDIT_SQS_QUEUE_URL', ''),
      serviceName: get('AUDIT_SERVICE_NAME', 'hmpps-community-accommodation-tier-2-ui'),
      logErrors: get('AUDIT_LOG_ERRORS', 'false') === 'true',
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  flags: {
    maintenanceMode: get('IN_MAINTENANCE_MODE', false),
    prisonDashboardEnabled: get('PRISON_DASHBOARD_ENABLED', false),
  },
  analytics: {
    tagManagerId: get('TAG_MANAGER_ID', null),
  },
}
