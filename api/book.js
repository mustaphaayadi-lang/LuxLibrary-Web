export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Missing book id' })
  }

  try {
    const url = `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`
    const response = await fetch(url)

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch book' })
    }

    const text = await response.text()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).send(text)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}