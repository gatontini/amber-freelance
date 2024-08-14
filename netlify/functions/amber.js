const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Accedi alla chiave API tramite la variabile d'ambiente
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // Usa la chiave API dalla variabile d'ambiente
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
