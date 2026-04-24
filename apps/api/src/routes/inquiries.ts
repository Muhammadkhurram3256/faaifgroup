import express from 'express';
import { InquirySchema } from 'design-system';
import { prisma } from '../lib/prisma';
import { sendInquiryEmails } from '../lib/mailer';

const router = express.Router();

router.post('/', async (req: any, res: any) => {
  const parsed = InquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Validation failed',
      issues: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { name, email, company, reason, message } = parsed.data;

  const inquiry = await prisma.inquiry.create({
    data: { name, email, company: company ?? null, reason, message },
    select: { id: true, createdAt: true },
  });

  sendInquiryEmails({
    id: inquiry.id,
    name,
    email,
    company,
    reason,
    message,
  }).catch((err) => console.error('[mailer]', err));

  res.status(201).json({ id: inquiry.id, createdAt: inquiry.createdAt });
});

export default router;
