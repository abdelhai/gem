import express from 'express';
import { Base } from 'deta'

const app = express();
app.use(express.json());

const db = Base('notes');

app.post('/save', async (req, res) => {
    let { doc, key } = req.body;
    if (doc || key) {
        const r = await db.put({ doc, key: key.toString() });
        return res.send(r);
    }
});

app.get('/get/:key', async (req, res) => {
    const data = await db.get(req.params.key) || {};
    return res.send(data);
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    }
);