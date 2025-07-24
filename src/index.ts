import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
const app = express();

const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET || "your_shopify_secret_here";

// Middleware to capture raw body
const rawBodySaver = (req: any, res: any, buf: Buffer) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString("utf8");
  }
};

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ extended: true, verify: rawBodySaver }));

function verifyShopifyWebhook(req: Request, res: Response, next: Function) {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  const rawBody = (req as any).rawBody;

  if (!hmacHeader || !rawBody) {
    return res.status(401).send("Unauthorized: Missing HMAC or body");
  }

  const generatedHmac = crypto
    .createHmac("sha256", SHOPIFY_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  if (generatedHmac !== hmacHeader) {
    return res.status(401).send("Unauthorized: Invalid HMAC");
  }

  next();
}

app.post('/webhooks/customers/data_request', verifyShopifyWebhook, (req: Request, res: Response) => {
  // Log the request for compliance tracking
  console.log('Customer data request:', req.body);
  res.status(200).send('OK');
});

app.post('/webhooks/customers/redact', verifyShopifyWebhook, (req: Request, res: Response) => {
  // Handle customer data deletion
  console.log('Customer data deletion:', req.body);
  res.status(200).send('OK');
});

app.post('/webhooks/shop/redact', verifyShopifyWebhook, (req: Request, res: Response) => {
  // Handle shop data deletion
  console.log('Shop data deletion:', req.body);
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});