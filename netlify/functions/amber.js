const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Crea il prompt per GPT-4 basato sulla richiesta dell'utente
    const prompt = `
    You are Amber, a virtual assistant who helps freelancers and studios with everyday tasks like content creation, email writing, and document preparation. Today, your task is to write a detailed 800-word blog article about renovating a house in Rome. The article should include an introduction, key considerations, budgeting tips, and common challenges. Be informative and engaging.

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
                model: "gpt-3.5-turbo", // Modello utilizzato
                messages: [{ role: "user", content: prompt }],
                max_tokens: 800, // Aumenta il numero di token a 800
                temperature: 0.7, // Temperatura per controllare la creatività della risposta
                top_p: 0.9 // Controlla la diversità delle risposte
            })
        });

        const data = await response.json();

        // Log della risposta completa per il debug
        console.log("API Response Full:", JSON.stringify(data, null, 2));

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
