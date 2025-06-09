// /pages/api/thankyou-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, full_name } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rtxalham@gmail.com',
      pass: 'qxqc zppq mhdj dslg',
    },
  });

  const mailOptions = {
    from: '"Desa Ampelan" <rtxalham@gmail.com>',
    to: email,
    subject: 'Terima kasih telah mendaftar',
    html: `<h2>Hai ${full_name || 'Pengguna'}</h2><p>Terima kasih telah mendaftar di layanan Desa Ampelan.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error', err);
    res.status(500).json({ success: false, error: err });
  }
}
