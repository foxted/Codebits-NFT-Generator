import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as functions from 'firebase-functions';

const app = express();

app.use(cors({origin: true}));

app.get('/metadata/:code', async (req, res) => {
    try {
        const {data} = await axios.get(`https://codebits-be425.web.app/${req.params.code}.json`);
        functions.logger.log('Some request', {data});
        res.json(data);
    } catch (e) {
        res.status(404).send();
    }
});

export const json = functions.https.onRequest(app);
