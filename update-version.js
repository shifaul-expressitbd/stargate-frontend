import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJsonPath = join(__dirname, 'package.json')

// Read and parse package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

// Version increment logic
const now = new Date()
const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
const versionParts = packageJson.version.split('-')
let buildNumber = versionParts.length > 2 ? parseInt(versionParts[2]) + 1 : 1
const newVersion = `1.0.0-${dateStr}-${String(buildNumber).padStart(2, '0')}`

// Update and write package.json
packageJson.version = newVersion
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log(`Updated version to ${newVersion}`)

// Write version.js
const versionJsPath = join(__dirname, 'public', 'version.js')
writeFileSync(versionJsPath, `export const version = '${newVersion}';`)