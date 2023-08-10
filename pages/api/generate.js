// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {

    const { x, y } = req.query;

    // You can customize this payload or get it from the incoming request (e.g., req.body)
    const payload = {
      "prompt": x + " " + y,
      "steps": 20,
      "styles": [
        "soulcats"
      ]
  }

    const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
      method: 'POST', // You can change this to 'PUT' or other methods as needed
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    // Extract the first image from the "images" array
    const firstImageBase64 = data.images && data.images[0];

    if (!firstImageBase64) {
      res.status(404).json({ error: 'No images found' });
      return;
    }

    // Convert the base64 string into a buffer and set the content type as 'image/*'
    const buffer = Buffer.from(firstImageBase64, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the data' });
  }
}
