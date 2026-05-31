export default async function onRequest({ request, env }) {
  const url = new URL(request.url)
  if (request.method === 'GET') {
    const keys = await env.TRIP_KV.list()
    const trips = []
    for (const k of keys.keys) {
      const data = await env.TRIP_KV.get(k.name, 'json')
      if (data) trips.push(data)
    }
    return Response.json(trips)
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const id = Date.now().toString()
    const trip = { id, ...body }
    await env.TRIP_KV.put(id, JSON.stringify(trip))
    return Response.json({ success: true })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
