const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Crea il prompt per GPT-4 basato sulla richiesta dell'utente
    const prompt = `
    You are Amber, a virtual assistant who helps freelancers and studios with everyday tasks like content creation, email writing, and document preparation. Provide practical advice and suggestions to improve communication and relationships with clients.

    User: ${userMessage}
    Amber:`;

    try {
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
        model: "gpt-3.5-turbo", // Passa a GPT-3.5-turbo
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200 // Puoi mantenere un numero di token simile
    })
});


        const data = await response.json();

        // Log della risposta API per il debug
        console.log("API Response:", JSON.stringify(data, null, 2));

        // Gestione della risposta
        const botMessage = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
            ? data.choices[0].message.content
            : "Mi dispiace, non sono riuscito a generare una risposta valida. Puoi riprovare?";

        return {
            statusCode: 200,
            body: JSON.stringify({ message: botMessage }),
        };
    } catch (error) {
        console.error("Error fetching from OpenAI:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Si è verificato un errore durante l'elaborazione della tua richiesta." }),
        };
    }
};
