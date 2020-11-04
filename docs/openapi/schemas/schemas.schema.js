import fs from 'fs';

export const bookSchema = JSON.parse(fs.readFileSync('docs\\openapi\\schemas\\book.json'));
export const userSchema = JSON.parse(fs.readFileSync('docs\\openapi\\schemas\\user.json'));
