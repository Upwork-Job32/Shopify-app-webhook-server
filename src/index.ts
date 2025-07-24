import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/webhooks/customers/data_request', (req: Request, res: Response) => {
  // Log the request for compliance tracking
  console.log('Customer data request:', req.body);
  res.status(200).send('OK');
});

app.post('/webhooks/customers/redact', (req: Request, res: Response) => {
  // Handle customer data deletion
  console.log('Customer data deletion:', req.body);
  res.status(200).send('OK');
});

app.post('/webhooks/shop/redact', (req: Request, res: Response) => {
  // Handle shop data deletion
  console.log('Shop data deletion:', req.body);
  res.status(200).send('OK');
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
}); 