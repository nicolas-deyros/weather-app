#!/usr/bin/env node

import { readFileSync } from 'fs'

/**
 * Simple commit message grammar checker
 * Validates basic commit message format and structure
 */

function checkCommitMessage(filePath: string) {
  try {
    const commitMessage = readFileSync(filePath, 'utf8').trim()
    
    // Skip merge commits and other special commits
    if (commitMessage.startsWith('Merge ') || 
        commitMessage.startsWith('Revert ') ||
        commitMessage.startsWith('Initial commit')) {
      return true
    }

    // Check if message is not empty
    if (!commitMessage) {
      console.error('❌ Commit message cannot be empty')
      return false
    }

    // Basic format check: should not end with a period
    if (commitMessage.split('\n')[0].endsWith('.')) {
      console.error('❌ Commit message should not end with a period')
      return false
    }

    // Check minimum length
    const firstLine = commitMessage.split('\n')[0]
    if (firstLine.length < 10) {
      console.error('❌ Commit message too short (minimum 10 characters)')
      return false
    }

    // Check maximum length for first line
    if (firstLine.length > 100) {
      console.error('❌ Commit message first line too long (maximum 100 characters)')
      return false
    }

    console.log('✅ Commit message grammar check passed')
    return true
  } catch (error) {
    console.error('❌ Error reading commit message:', error)
    return false
  }
}

// Get the commit message file path from command line arguments
const commitMsgFile = process.argv[2]

if (!commitMsgFile) {
  console.error('❌ Usage: check-commit-grammar.ts <commit-msg-file>')
  process.exit(1)
}

const isValid = checkCommitMessage(commitMsgFile)
process.exit(isValid ? 0 : 1)
