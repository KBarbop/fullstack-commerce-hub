import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import WebSocket, { WebSocketServer } from 'ws';
import customerRoutes from './users/routes/customer.routes';
import userRoutes from './users/routes/user.routes';
import adminRoutes from './users/routes/admin.routes';
import categoryRoutes from './categories/category.routes';
import productRoutes from './products/product.routes';
import orderRoutes from './orders/order.routes';
import emailRoutes from './email-service/emai-service.routes';
import https from 'https';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 8000;
const acceptedUrls = (process.env.ACCEPTED_URLS || '').split(',');

app.use((req, res, next) => {
  console.log(`Incoming request from origin: ${req.headers.origin}`);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (acceptedUrls.includes(origin || '') || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

const uri = process.env.ATLAS_URI || '';
mongoose.set('strictQuery', false);
mongoose.connect(uri);

mongoose.connection.once('open', () => {
  console.log(`[server]: MongoDB database connection established successfully`);
});

app.use('/users', userRoutes);
app.use('/users/customers', customerRoutes);
app.use('/users/admins', adminRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/email-service', emailRoutes);

app.get('/', (req, res) => {
  res.send(`Commerce Hub API`);
});

// Use HTTPS if SSL certs are provided, otherwise fall back to HTTP (e.g. local dev / Docker)
const server =
  process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH
    ? https
        .createServer(
          {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH),
          },
          app,
        )
        .listen(PORT, '0.0.0.0', () => {
          console.log(`[server]: Commerce Hub API is running at https://localhost:${PORT}`);
        })
    : app.listen(PORT, '0.0.0.0', () => {
        console.log(`[server]: Commerce Hub API is running at http://localhost:${PORT}`);
      });

const wss = new WebSocketServer({ server });

const notifyClients = (order: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'newOrder', order }));
    }
  });
};

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (message: WebSocket.MessageEvent) => {
    console.log(`Received message => ${message}`);
  });
});

export { notifyClients };
