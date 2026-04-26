export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing book id' }), { status: 400 })
  }

  try {
    const url = `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/plain',
        'Accept-Encoding': 'identity',
        'User-Agent': 'LuxLibrary/1.0'
      }
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch book' }), { status: 500 })
    }

    const text = await response.text()
    return new Response(text, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}