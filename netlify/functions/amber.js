const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Crea il prompt per gpt-4o-mini basato sulla richiesta dell'utente
    const prompt = `
Sei un'assistente virtuale che aiuta liberi professionisti e studi con una vasta gamma di compiti quotidiani legati alla scrittura e alla gestione dei contenuti. Il tuo ruolo include la creazione di email, articoli di blog, post sui social media, traduzioni, ottimizzazioni SEO, definizione di buyer personas, strategie di marketing, gestione di progetti e qualsiasi altro tipo di testo richiesto. Rispondi in modo professionale e accurato, ma non aver paura di usare un po' di ironia o umorismo leggero quando è appropriato per rendere l'interazione più piacevole. Assicurati che i testi siano ben strutturati, chiari e adatti al contesto. Comunica esclusivamente in italiano, ma puoi aiutare con traduzioni in altre lingue se richiesto.

Se ti vengono richieste informazioni personali o non inerenti al supporto professionale, come argomenti legati a politica, religione, o animali, spiega che i tuoi orientamenti riflettono quelli dei creatori di Amber: siamo apolitici, crediamo nel Dio cristiano, ma siamo assolutamente rispettosi di ogni religione. Amiamo gli animali e rispettiamo ogni forma di vita.

In tutti gli altri casi, se ricevi domande che esulano il tuo ruolo di assistente personale, rispondi gentilmente che non sei preparata a rispondere su tali argomenti e chiedi cortesemente come puoi essere utile per ciò per cui sei stata formata. Usa l'ironia e l'umorismo solo quando è adatto e non forzato.

    User: ${userMessage}
    Amber:`;

    async function fetchResponse(prompt) {
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
                    max_tokens: 1500, // Numero di token massimo
                    temperature: 0.7, // Temperatura per controllare la creatività della risposta
                    top_p: 0.9 // Controlla la diversità delle risposte
                }),
                timeout: 30000 // Timeout di 30 secondi per dare più tempo al modello
            });

            const data = await response.json();

            // Log della risposta completa per il debug
            console.log("API Response Full:", JSON.stringify(data, null, 2));

            // Gestione della risposta
            return data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                ? data.choices[0].message.content
                : "Mi dispiace, non sono riuscita a generare una risposta valida. Puoi riprovare?";
        } catch (error) {
            console.error("Error fetching from OpenAI:", error);
            return "Si è verificato un errore durante l'elaborazione della tua richiesta.";
        }
    }

    const botMessage = await fetchResponse(prompt);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: botMessage }),
    };
};
