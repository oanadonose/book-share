import fs from 'fs';

let bookSchema = JSON.parse(fs.readFileSync('docs\\openapi\\schemas\\book.json'));
delete bookSchema['definitions'];

let userSchema = JSON.parse(fs.readFileSync('docs\\openapi\\schemas\\user.json'));
delete userSchema['definitions'];

export {bookSchema, userSchema};
