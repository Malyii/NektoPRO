const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const activeUsers = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [hash, expires] of activeUsers.entries()) {
        if (now > expires) {
            activeUsers.delete(hash);
        }
    }
}, 10000);

app.post('/api/ping', (req, res) => {
    const { hash } = req.body;
    if (!hash || typeof hash !== 'string' || hash.length < 10) {
        return res.status(400).json({ ok: false, err: 'bad hash' });
    }
    activeUsers.set(hash, Date.now() + 45000);
    res.json({ ok: true, online: activeUsers.size });
});

app.get('/api/online', (req, res) => {
    res.json({ ok: true, online: activeUsers.size });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
