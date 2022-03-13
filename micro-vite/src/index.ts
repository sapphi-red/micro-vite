import cac from 'cac'
import { startDev } from './dev'
import { startBuild } from './build'

const cli = cac()

cli.command('dev')
  .action(() => {
    startDev()
  })

cli.command('build')
  .action(() => {
    startBuild()
  })

cli.help()

cli.parse()
