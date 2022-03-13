import chokidar from 'chokidar'

export const createFileWatcher = (onChange: (eventName: string, path: string) => void) => {
  const watcher = chokidar.watch('**/*', {
    ignored: ['node_modules', '.git'],
    ignoreInitial: true
  })
  watcher.on('all', (eventName, path) => {
    onChange(eventName, path)
  })
}
