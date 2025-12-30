import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'The Interop <noreply@noreply.jessealton.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jessealton.com';

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${SITE_URL}/api/confirm?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Confirm your subscription to The Interop',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; color: #e4e4e7; padding: 40px 20px; margin: 0;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #18181b; border-radius: 12px; padding: 40px; border: 1px solid #27272a;">
            <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 24px 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              The Interop
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; color: #a1a1aa;">
              Thanks for subscribing! Please confirm your email address to start receiving weekly insights on AI strategy, agent development, and business transformation.
            </p>
            
            <a href="${confirmUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Confirm Subscription
            </a>
            
            <p style="font-size: 14px; color: #71717a; margin: 32px 0 0 0; line-height: 1.5;">
              If you didn&apos;t request this, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;">
            
            <p style="font-size: 12px; color: #52525b; margin: 0;">
              The Interop by Jesse Alton<br>
              <a href="${SITE_URL}" style="color: #6366f1;">jessealton.com</a>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Thanks for subscribing to The Interop!

Please confirm your email address by visiting this link:
${confirmUrl}

If you didn't request this, you can safely ignore this email.

---
The Interop by Jesse Alton
${SITE_URL}
    `.trim(),
  });

  if (error) {
    console.error('Failed to send confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }

  return data;
}

export async function sendWelcomeEmail(email: string) {
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to The Interop! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; color: #e4e4e7; padding: 40px 20px; margin: 0;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #18181b; border-radius: 12px; padding: 40px; border: 1px solid #27272a;">
            <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 24px 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              Welcome to The Interop!
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #e4e4e7;">
              You&apos;re all set! You&apos;ll now receive weekly insights at the intersection of AI, business transformation, and emerging technology.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; color: #a1a1aa;">
              This isn&apos;t academic theory—it&apos;s practical insights from building and deploying AI systems for real organizations.
            </p>
            
            <a href="${SITE_URL}/blog" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Read the Latest Posts
            </a>
            
            <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;">
            
            <p style="font-size: 12px; color: #52525b; margin: 0;">
              The Interop by Jesse Alton<br>
              <a href="${SITE_URL}" style="color: #6366f1;">jessealton.com</a> • 
              <a href="${unsubscribeUrl}" style="color: #52525b;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to The Interop!

You're all set! You'll now receive weekly insights at the intersection of AI, business transformation, and emerging technology.

This isn't academic theory—it's practical insights from building and deploying AI systems for real organizations.

Read the latest posts: ${SITE_URL}/blog

---
The Interop by Jesse Alton
${SITE_URL}

Unsubscribe: ${unsubscribeUrl}
    `.trim(),
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - welcome email is nice to have but not critical
  }

  return data;
}

interface NewsletterOptions {
  subject: string;
  previewText: string;
  title: string;
  excerpt: string;
  postUrl: string;
  coverImage?: string;
}

export async function sendNewsletterEmail(
  emails: string[],
  options: NewsletterOptions
) {
  const results = [];

  // Send in batches of 50 to avoid rate limits
  const batchSize = 50;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    const promises = batch.map(async (email) => {
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;

      try {
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: options.subject,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
          },
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; color: #e4e4e7; padding: 40px 20px; margin: 0;">
                <div style="max-width: 560px; margin: 0 auto; background-color: #18181b; border-radius: 12px; padding: 40px; border: 1px solid #27272a;">
                  <p style="font-size: 12px; color: #52525b; margin: 0 0 24px 0;">
                    ${options.previewText}
                  </p>
                  
                  <h1 style="font-size: 14px; font-weight: 600; margin: 0 0 24px 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    The Interop
                  </h1>
                  
                  ${options.coverImage ? `<img src="${options.coverImage}" alt="" style="width: 100%; border-radius: 8px; margin-bottom: 24px;">` : ''}
                  
                  <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #e4e4e7;">
                    ${options.title}
                  </h2>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; color: #a1a1aa;">
                    ${options.excerpt}
                  </p>
                  
                  <a href="${options.postUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Read Full Post →
                  </a>
                  
                  <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;">
                  
                  <p style="font-size: 12px; color: #52525b; margin: 0;">
                    The Interop by Jesse Alton<br>
                    <a href="${SITE_URL}" style="color: #6366f1;">jessealton.com</a> • 
                    <a href="${unsubscribeUrl}" style="color: #52525b;">Unsubscribe</a>
                  </p>
                </div>
              </body>
            </html>
          `,
          text: `
${options.title}

${options.excerpt}

Read the full post: ${options.postUrl}

---
The Interop by Jesse Alton
${SITE_URL}

Unsubscribe: ${unsubscribeUrl}
          `.trim(),
        });

        if (error) {
          console.error(`Failed to send to ${email}:`, error);
          return { email, success: false, error };
        }

        return { email, success: true, data };
      } catch (err) {
        console.error(`Failed to send to ${email}:`, err);
        return { email, success: false, error: err };
      }
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);

    // Small delay between batches
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

