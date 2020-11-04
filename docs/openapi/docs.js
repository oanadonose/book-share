import express from 'express';
import serveStatic from 'serve-static';

const app = express();

app.use(serveStatic('D:\\University\\304CEM\\cw\\PublicLibrary-Backend\\docs\\openapi', { 'index': ['index.html'] }));
console.log('served static');
const port = 8080;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
