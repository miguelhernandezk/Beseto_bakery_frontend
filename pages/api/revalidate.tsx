import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.NEXT_PUBLIC_MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (
    req.query.pathToRev !== undefined &&
    typeof req.query.pathToRev === 'string'
  ) {
    try {
      // this should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"
      // http://localhost:3000/api/revalidate?secret=pacman1823&pathToRev=%2Fproducts%2F6366ecd4b1613524706f4ebf
      await res.revalidate(req.query.pathToRev);
      return res.json({ revalidated: true });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send('Error revalidating');
    }
  } else return res.status(500).send('Error revalidating');
}
