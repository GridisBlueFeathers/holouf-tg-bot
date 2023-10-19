export async function POST(request: Request) {
    const req = await request.json()
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_KEY}/sendMessage`, {
        method: "POST",
        headers: {
        "Content-type": "application/json"
        },
        body: JSON.stringify({
            chat_id: process.env.MY_TG_ID,
            text: JSON.stringify(req) 
        }) 
    })

    return new Response(JSON.stringify({hey: "HEY"}))
}
