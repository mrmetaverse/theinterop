#!/usr/bin/env node
/**
 * Generate secure admin password
 * Run: node --loader ts-node/esm scripts/generate-admin-password.ts
 */

import { randomBytes } from 'crypto';

// Generate a secure 32-character password
const password = randomBytes(24).toString('base64').slice(0, 32);

console.log('\n===========================================');
console.log('ADMIN PASSWORD GENERATED');
console.log('===========================================\n');
console.log('Add this to your .env.local file:\n');
console.log(`ADMIN_PASSWORD=${password}\n`);
console.log('Admin email: jesse@alton.tech');
console.log('\n⚠️  SAVE THIS PASSWORD SECURELY!\n');
console.log('===========================================\n');
