import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'

async function updateImports() {
  const files = await glob('src/**/*.ts')

  console.log(`Found ${files.length} TypeScript files`)

  for (const file of files) {
    let content = readFileSync(file, 'utf-8')
    const originalContent = content

    // Atualizar imports de @/domain para @/@core/domain
    content = content.replace(/@\/domain\//g, '@/@core/domain/')
    
    // Atualizar imports de @/shared para @/@shared/kernel
    content = content.replace(/@\/shared\//g, '@/@shared/kernel/')
    
    // Atualizar imports de @/infra para @/@infra
    content = content.replace(/@\/infra\//g, '@/@infra/')
    
    // Atualizar imports de @/interface/factories para @/@core/application/factories
    content = content.replace(/@\/interface\/factories\//g, '@/@core/application/factories/')
    
    // Atualizar imports de @/interface/http/presenters para @/@presentation/presenters
    content = content.replace(/@\/interface\/http\/presenters\//g, '@/@presentation/presenters/')
    
    // Atualizar imports de @/modules para @/@presentation/modules
    content = content.replace(/@\/modules\//g, '@/@presentation/modules/')
    
    // Atualizar app.module
    content = content.replace(/from '@\/app\.module'/g, "from '@/@presentation/app.module'")

    if (content !== originalContent) {
      writeFileSync(file, content, 'utf-8')
      console.log(`✅ Updated: ${file}`)
    }
  }

  console.log('\n✨ All imports updated!')
}

updateImports().catch(console.error)
