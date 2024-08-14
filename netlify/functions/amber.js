const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_NEW_API_KEY` // Sostituisci con la tua nuova chiave API
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }]
        })
    });

    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: data.choices[0].message.content }),
    };
};
