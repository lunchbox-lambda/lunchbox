import * as debug from 'debug'

type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

const mapLevelIcon = (level: Level) => {
  switch (level) {
    case 'debug': return '🐞'
    case 'info': return 'ℹ️'
    case 'warn': return '💢'
    case 'error': return '🔥'
    case 'fatal': return '💣'
    default: return ' '
  }
}

const mapLevelPrefix = (level: Level) => {
  switch (level) {
    case 'warn': return 'WARNING'
    case 'error': return 'ERROR'
    case 'fatal': return 'FATAL'
    default: return null
  }
}

export default function log(namespace: string) {
  const _debug = debug(namespace)
  return (message: string, level: Level = 'info') => {
    let icon = mapLevelIcon(level)
    let prefix = mapLevelPrefix(level)
    if (prefix) message = `${prefix}: ${message}`
    _debug(`[${icon}] ${message}`)
  }
}
