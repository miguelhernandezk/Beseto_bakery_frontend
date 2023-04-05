function credentialsAuth(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  if (req.body.password === process.env.AUTH_BESETO_SECRET) {
    const besetoUser = {
      name: 'Nahomi',
      email: 'nahomi@gmail.com',
      image: '',
    };
    res.status(200).json(besetoUser);
  }
  res.status(401).end();
}

export default credentialsAuth;
