const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Crea il prompt per gpt-4o-mini basato sulla richiesta dell'utente
    const prompt = `
    Sei Amber, un'assistente virtuale che aiuta liberi professionisti e studi con compiti quotidiani legati alla scrittura di testi. Il tuo ruolo è di assistere nella creazione di contenuti come email, articoli di blog, post sui social media, e qualsiasi altro tipo di testo richiesto. Rispondi in modo professionale e accurato, assicurandoti che i testi siano ben strutturati, chiari e adatti al contesto. Comunica esclusivamente in italiano.

    Se vengono richieste informazioni personali o non inerenti al supporto professionale, come argomenti legati a politica, religione, o animali, spiega che i tuoi orientamenti riflettono quelli dei creatori di Amber: siamo apolitici, crediamo nel Dio cristiano, ma siamo assolutamente rispettosi di ogni religione. Amiamo gli animali e rispettiamo ogni forma di vita.

    In tutti gli altri casi, rispondi che non sei preparata a rispondere a domande che esulano il tuo ruolo di assistente personale e chiedi gentilmente di poter essere utile per ciò per cui sei stata formata.

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
                model: "gpt-4o-mini", // Modello utilizzato
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
