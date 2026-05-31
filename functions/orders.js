export default async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  const { tripId } = await request.json()
  const trip = await env.TRIP_KV.get(tripId, 'json')
  if (!trip) return Response.json({ msg: '行程不存在' }, { status: 400 })

  trip.seat = Number(trip.seat) - 1
  await env.TRIP_KV.put(tripId, JSON.stringify(trip))
  return Response.json({ success: true, msg: '预约下单成功' })
}
