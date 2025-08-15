import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { key, contentType } = (req.body || {});
    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType || 'application/octet-stream'
    });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
    res.status(200).json({ url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
