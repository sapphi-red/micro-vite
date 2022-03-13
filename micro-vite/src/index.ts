import cac from 'cac'
import { startDev } from './dev'

const cli = cac()

cli.command('dev')
  .action(() => {
    startDev()
  })

cli.command('build')
  .action(() => {
    console.log('build start')
  })

cli.help()

cli.parse()
