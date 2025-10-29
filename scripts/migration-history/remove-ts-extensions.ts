import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

async function getAllTsFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build') {
          continue
        }
        files.push(...await getAllTsFiles(fullPath))
      } else if (entry.name.endsWith('.ts')) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }
  
  return files
}

async function removeTsExtensionsFromFile(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, 'utf-8')
    
    // Regex para encontrar imports com extensão .ts
    // Matches: from './file.ts' ou from '@/path/file.ts' ou from "../file.ts"
    const tsExtensionRegex = /from\s+['"]([^'"]+)\.ts['"]/g
    
    let modified = false
    const newContent = content.replace(tsExtensionRegex, (match, importPath) => {
      modified = true
      return `from '${importPath}'`
    })
    
    if (modified) {
      await writeFile(filePath, newContent, 'utf-8')
      return true
    }
    
    return false
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    return false
  }
}

async function main() {
  console.log('🔍 Searching for TypeScript files...')
  
  const srcDir = join(process.cwd(), 'src')
  const testDir = join(process.cwd(), 'test')
  
  const allFiles = [
    ...await getAllTsFiles(srcDir),
    ...await getAllTsFiles(testDir),
  ]
  
  console.log(`📝 Found ${allFiles.length} TypeScript files`)
  console.log('🔧 Removing .ts extensions from imports...\n')
  
  let modifiedCount = 0
  
  for (const file of allFiles) {
    const wasModified = await removeTsExtensionsFromFile(file)
    if (wasModified) {
      modifiedCount++
      const relativePath = file.replace(process.cwd(), '.')
      console.log(`✅ Modified: ${relativePath}`)
    }
  }
  
  console.log(`\n✨ Done! Modified ${modifiedCount} files out of ${allFiles.length}`)
}

main()
