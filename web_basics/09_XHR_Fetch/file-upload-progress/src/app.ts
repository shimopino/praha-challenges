import express from 'express';
import { onStatus, onUpload } from './handler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.post('/upload', onUpload);
app.get('/status', onStatus);

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
