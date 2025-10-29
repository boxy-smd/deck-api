import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'

async function updateE2ETests() {
  const files = await glob('src/**/*.e2e-spec.ts')

  console.log(`Found ${files.length} E2E test files`)

  for (const file of files) {
    let content = readFileSync(file, 'utf-8')
    let modified = false

    // Replace import { app } from '@/app' with the new setup
    if (content.includes("import { app } from '@/app'")) {
      content = content.replace(
        /import { app } from '@\/app'/g,
        '',
      )
      
      // Add the new import if not exists
      if (!content.includes('test/e2e/setup-app')) {
        const importIndex = content.indexOf('import request')
        if (importIndex !== -1) {
          const firstImport = content.substring(0, content.indexOf('\n', importIndex) + 1)
          content = firstImport + "import { closeTestApp, createTestApp } from 'test/e2e/setup-app'\n" + content.substring(content.indexOf('\n', importIndex) + 1)
        }
      }
      
      modified = true
    }

    // Replace await app.ready() with await createTestApp()
    if (content.includes('await app.ready()')) {
      content = content.replace(/await app\.ready\(\)/g, 'await createTestApp()')
      modified = true
    }

    // Replace await app.close() with await closeTestApp()
    if (content.includes('await app.close()')) {
      content = content.replace(/await app\.close\(\)/g, 'await closeTestApp()')
      modified = true
    }

    // Replace app.server with app.getHttpServer()
    if (content.includes('app.server')) {
      // Add const app = await createTestApp() at the start of each test if needed
      if (!content.includes('const app = await createTestApp()')) {
        content = content.replace(
          /it\('(.+)', async \(\) => \{/g,
          (match, testName) => {
            return `it('${testName}', async () => {\n    const app = await createTestApp()`
          }
        )
      }
      
      content = content.replace(/app\.server/g, 'app.getHttpServer()')
      modified = true
    }

    // Clean up empty imports
    content = content.replace(/import { app } from '@\/app'\n/g, '')
    content = content.replace(/\n\n\n+/g, '\n\n')

    if (modified) {
      writeFileSync(file, content, 'utf-8')
      console.log(`✅ Updated: ${file}`)
    } else {
      console.log(`⏭️  Skipped: ${file}`)
    }
  }

  console.log('\n✨ All E2E tests updated!')
}

updateE2ETests().catch(console.error)
