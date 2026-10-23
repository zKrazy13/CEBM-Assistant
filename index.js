try {
    require("dotenv").config();
} catch {

}

const fs = require("fs");
const path = require("path");
const {
    ActionRowBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    Events,
    GatewayIntentBits,
    PermissionFlagsBits,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");

// Con Guilds basta para comandos con / , menús y botones.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const COLOR = 0x4752c4;
const EFIMERO = 64; // mensaje que solo ve quien usó el comando
const VISTAS = ["carreras", "precios", "ubicacion", "sobre", "ayuda"];
const URL_MAPA =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
        "Centro Educativo Bilingue Metodista Barrio Willie Warren Roatan Honduras",
    );

// ───────────────────────── Comandos ─────────────────────────

const commands = [
    new SlashCommandBuilder()
        .setName("menu")
        .setDescription("Muestra el menú de opciones."),
    new SlashCommandBuilder()
        .setName("carreras")
        .setDescription("Muestra las carreras disponibles."),
    new SlashCommandBuilder()
        .setName("precios")
        .setDescription("Muestra los precios mensuales."),
    new SlashCommandBuilder()
        .setName("ubicacion")
        .setDescription("Muestra la ubicación del centro educativo."),
    new SlashCommandBuilder()
        .setName("sobre")
        .setDescription("Muestra la información del bot."),
    new SlashCommandBuilder()
        .setName("ayuda")
        .setDescription("Muestra la ayuda del bot."),
    new SlashCommandBuilder()
        .setName("idioma")
        .setDescription("Cambia entre español e inglés / Switch Spanish-English."),
    new SlashCommandBuilder()
        .setName("quiz")
        .setDescription("Responde una pregunta de informática."),
    new SlashCommandBuilder()
        .setName("encuesta")
        .setDescription("Cuéntanos qué tanto te gustó el bot."),
    new SlashCommandBuilder()
        .setName("resultados")
        .setDescription("Muestra los resultados de la encuesta (solo administradores).")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
].map((command) => command.toJSON());

// ───────────────────────── Textos (español / inglés) ─────────────────────────

const textos = {
    es: {
        pie: "CEBM Assistant • Centro Educativo Bilingue Metodista",
        menuTitulo: "Menú de CEBM Assistant",
        menuDescripcion:
            "¿Qué quieres consultar? Elige una opción del menú de abajo.",
        placeholder: "Elige una opción",
        nombres: {
            carreras: "Carreras",
            precios: "Precios",
            ubicacion: "Ubicación",
            sobre: "Sobre",
            ayuda: "Ayuda",
        },
        descripciones: {
            carreras: "Muestra las carreras disponibles.",
            precios: "Muestra los precios mensuales.",
            ubicacion: "Muestra la ubicación del centro educativo.",
            sobre: "Muestra la información del bot.",
            ayuda: "Muestra la ayuda del bot.",
        },
        respuestas: {
            carreras: [
                "Carreras disponibles:",
                "7mo Grado",
                "8vo Grado",
                "9no Grado",
                "10mo Grado",
                "11vo Bachillerato Tecnico Profesional en Informatica",
                "11vo Bachillerato Tecnico Profesional en Contaduria y Finanzas",
                "11vo Bachillerato en Ciencias y Humanidades",
                "12vo Bachillerato Tecnico Profesional en Informatica",
                "12vo Bachillerato Tecnico Profesional en Contaduria y Finanzas",
            ].join("\n"),
            precios: [
                "8vo Grado 4500Lps mensual",
                "9no Grado 4000Lps mensual",
                "10mo Grado 5000Lps mensual",
                "11vo Bachillerato Tecnico Profesional en Informatica 5400Lps mensual",
                "11vo Bachillerato Tecnico Profesional en Contaduria y Finanzas 5200Lps mensual",
                "11vo Bachillerato en Ciencias y Humanidades 5000Lps mensual",
                "12vo Bachillerato Tecnico Profesional en Informatica 6.000Lps mensual",
                "12vo Bachillerato Tecnico Profesional en Contaduria y Finanzas 6.000Lps mensual",
            ].join("\n"),
            ubicacion: [
                "Centro Educativo Bilingue Metodista, Barrio Willie Warren, Roatan, Honduras.",
            ].join("\n"),
            sobre: [
                "Este bot fue creado por: II de Bachillerato Tecnico Profesional en Informatica, Centro Educativo Bilingue Metodista, Roatan, Honduras.",
                "Con el fin de ayudar a los estudiantes y padres de familia a obtener información sobre las carreras, precios y ubicación del centro educativo.",
            ].join("\n"),
            ayuda: [
                "Comandos disponibles:",
                "/menu - Muestra el menú de opciones.",
                "/carreras - Muestra las carreras disponibles.",
                "/precios - Muestra los precios mensuales.",
                "/ubicacion - Muestra la ubicación del centro educativo.",
                "/sobre - Muestra la información del bot.",
                "/ayuda - Muestra la ayuda del bot.",
                "/idioma - Cambia entre español e inglés.",
                "/quiz - Responde una pregunta de informática.",
                "/encuesta - Cuéntanos qué tanto te gustó el bot.",
            ].join("\n"),
        },
        botones: {
            menu: "Menú",
            idioma: "English",
            encuesta: "Opinión",
            mapa: "Ver en el mapa",
        },
        quiz: {
            titulo: "🧠 Quiz de informática",
            correcto: "✅ ¡Correcto!",
            incorrecto: "❌ Incorrecto",
            respuesta: "Respuesta correcta",
            puntaje: "Tu puntaje",
            otra: "Otra pregunta",
        },
        encuesta: {
            titulo: "⭐ Tu opinión",
            descripcion:
                "¿Qué tanto te gustó CEBM Assistant? Elige de 1 (poco) a 5 (mucho).",
            gracias: "¡Gracias por tu opinión! Tu calificación: {n} ⭐",
        },
        resultados: {
            titulo: "📊 Resultados de la encuesta",
            vacio: "Todavía no hay votos.",
            promedio: "Promedio",
            votos: "votos",
            sinPermiso: "Solo los administradores pueden ver los resultados.",
        },
    },
    en: {
        pie: "CEBM Assistant • Centro Educativo Bilingue Metodista",
        menuTitulo: "CEBM Assistant Menu",
        menuDescripcion:
            "What would you like to look up? Choose an option from the menu below.",
        placeholder: "Choose an option",
        nombres: {
            carreras: "Programs",
            precios: "Prices",
            ubicacion: "Location",
            sobre: "About",
            ayuda: "Help",
        },
        descripciones: {
            carreras: "Shows the available programs.",
            precios: "Shows the monthly prices.",
            ubicacion: "Shows the school's location.",
            sobre: "Shows information about the bot.",
            ayuda: "Shows the bot's help.",
        },
        respuestas: {
            carreras: [
                "Available programs:",
                "7th Grade",
                "8th Grade",
                "9th Grade",
                "10th Grade",
                "11th Grade - Professional Technical Baccalaureate in Computer Science",
                "11th Grade - Professional Technical Baccalaureate in Accounting and Finance",
                "11th Grade - Baccalaureate in Sciences and Humanities",
                "12th Grade - Professional Technical Baccalaureate in Computer Science",
                "12th Grade - Professional Technical Baccalaureate in Accounting and Finance",
            ].join("\n"),
            precios: [
                "8th Grade - 4500 Lps per month",
                "9th Grade - 4000 Lps per month",
                "10th Grade - 5000 Lps per month",
                "11th Grade - Professional Technical Baccalaureate in Computer Science - 5400 Lps per month",
                "11th Grade - Professional Technical Baccalaureate in Accounting and Finance - 5200 Lps per month",
                "11th Grade - Baccalaureate in Sciences and Humanities - 5000 Lps per month",
                "12th Grade - Professional Technical Baccalaureate in Computer Science - 6,000 Lps per month",
                "12th Grade - Professional Technical Baccalaureate in Accounting and Finance - 6,000 Lps per month",
            ].join("\n"),
            ubicacion: [
                "Centro Educativo Bilingue Metodista, Barrio Willie Warren, Roatan, Honduras.",
            ].join("\n"),
            sobre: [
                "This bot was created by: the second year of the Professional Technical Baccalaureate in Computer Science, Centro Educativo Bilingue Metodista, Roatan, Honduras.",
                "Its goal is to help students and parents get information about the school's programs, prices and location.",
            ].join("\n"),
            ayuda: [
                "Available commands:",
                "/menu - Shows the options menu.",
                "/carreras - Shows the available programs.",
                "/precios - Shows the monthly prices.",
                "/ubicacion - Shows the school's location.",
                "/sobre - Shows information about the bot.",
                "/ayuda - Shows the bot's help.",
                "/idioma - Switches between Spanish and English.",
                "/quiz - Answer a computer science question.",
                "/encuesta - Tell us how much you liked the bot.",
            ].join("\n"),
        },
        botones: {
            menu: "Menu",
            idioma: "Español",
            encuesta: "Feedback",
            mapa: "View on map",
        },
        quiz: {
            titulo: "🧠 Computer science quiz",
            correcto: "✅ Correct!",
            incorrecto: "❌ Incorrect",
            respuesta: "Correct answer",
            puntaje: "Your score",
            otra: "Another question",
        },
        encuesta: {
            titulo: "⭐ Your feedback",
            descripcion:
                "How much did you like CEBM Assistant? Choose from 1 (a little) to 5 (a lot).",
            gracias: "Thanks for your feedback! Your rating: {n} ⭐",
        },
        resultados: {
            titulo: "📊 Survey results",
            vacio: "There are no votes yet.",
            promedio: "Average",
            votos: "votes",
            sinPermiso: "Only administrators can see the results.",
        },
    },
};

// ───────────────────────── Preguntas del quiz ─────────────────────────
// "o" puede ser una lista común o { es: [...], en: [...] }.
// "c" es la posición de la respuesta correcta dentro de "o".

const preguntas = [
    {
        p: { es: "¿Qué significan las siglas RAM?", en: "What does RAM stand for?" },
        o: ["Random Access Memory", "Read Access Module", "Rapid Application Memory", "Remote Access Manager"],
        c: 0,
        e: {
            es: "RAM es la memoria de acceso aleatorio: guarda datos temporales mientras la computadora trabaja.",
            en: "RAM is Random Access Memory: it holds temporary data while the computer works.",
        },
    },
    {
        p: {
            es: "¿Qué lenguaje se usa para darle estilo (colores, tamaños, diseño) a una página web?",
            en: "Which language is used to style a web page (colors, sizes, layout)?",
        },
        o: ["HTML", "CSS", "SQL", "Python"],
        c: 1,
        e: {
            es: "CSS controla la apariencia de una página; HTML define su estructura.",
            en: "CSS controls how a page looks; HTML defines its structure.",
        },
    },
    {
        p: { es: "¿Cuánto vale 1010 en binario, en decimal?", en: "What is 1010 in binary, in decimal?" },
        o: ["8", "10", "12", "14"],
        c: 1,
        e: {
            es: "1010 = 8 + 0 + 2 + 0 = 10.",
            en: "1010 = 8 + 0 + 2 + 0 = 10.",
        },
    },
    {
        p: { es: "¿Qué significan las siglas HTTP?", en: "What does HTTP stand for?" },
        o: ["HyperText Transfer Protocol", "High Transfer Text Process", "HyperLink Terminal Protocol", "Home Tool Transfer Program"],
        c: 0,
        e: {
            es: "HTTP es el protocolo que usan los navegadores para pedir páginas web.",
            en: "HTTP is the protocol browsers use to request web pages.",
        },
    },
    {
        p: { es: "¿Para qué se usa SQL?", en: "What is SQL used for?" },
        o: {
            es: ["Consultar y administrar bases de datos", "Editar fotos", "Crear animaciones 3D", "Comprimir archivos"],
            en: ["Querying and managing databases", "Editing photos", "Creating 3D animations", "Compressing files"],
        },
        c: 0,
        e: {
            es: "SQL es el lenguaje estándar para trabajar con bases de datos.",
            en: "SQL is the standard language for working with databases.",
        },
    },
    {
        p: { es: "En programación, ¿qué es una variable?", en: "In programming, what is a variable?" },
        o: {
            es: ["Un espacio con nombre que guarda un valor", "Un error del programa", "Un tipo de monitor", "Una red social"],
            en: ["A named space that stores a value", "A program error", "A type of monitor", "A social network"],
        },
        c: 0,
        e: {
            es: "Una variable guarda un dato (número, texto...) que el programa puede usar y cambiar.",
            en: "A variable stores a piece of data (number, text...) that the program can use and change.",
        },
    },
    {
        p: { es: "¿Qué significan las siglas CPU?", en: "What does CPU stand for?" },
        o: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Power Unit"],
        c: 0,
        e: {
            es: "La CPU es el procesador: el \"cerebro\" que ejecuta las instrucciones.",
            en: "The CPU is the processor: the \"brain\" that executes instructions.",
        },
    },
    {
        p: {
            es: "¿Qué símbolo inicia un comentario de una línea en JavaScript?",
            en: "Which symbol starts a single-line comment in JavaScript?",
        },
        o: ["//", "#", "<!--", "--"],
        c: 0,
        e: {
            es: "En JavaScript, // comenta el resto de la línea. # se usa en Python.",
            en: "In JavaScript, // comments out the rest of the line. # is used in Python.",
        },
    },
    {
        p: { es: "¿Qué hace un firewall?", en: "What does a firewall do?" },
        o: {
            es: ["Controla el tráfico de red y bloquea accesos no autorizados", "Acelera la memoria RAM", "Guarda copias de las fotos", "Enfría el procesador"],
            en: ["Controls network traffic and blocks unauthorized access", "Speeds up RAM", "Stores photo backups", "Cools the processor"],
        },
        c: 0,
        e: {
            es: "Un firewall filtra las conexiones para proteger una red o un equipo.",
            en: "A firewall filters connections to protect a network or a computer.",
        },
    },
    {
        p: { es: "¿Cuál de estas es la contraseña más segura?", en: "Which of these is the most secure password?" },
        o: ["123456", "maria2008", "Gt7#pL9!vQ2m", "contraseña"],
        c: 2,
        e: {
            es: "Una contraseña segura es larga y mezcla letras, números y símbolos, sin datos personales.",
            en: "A secure password is long and mixes letters, numbers and symbols, with no personal data.",
        },
    },
];

function opcionesDe(pregunta, idioma) {
    return Array.isArray(pregunta.o) ? pregunta.o : pregunta.o[idioma];
}

// ───────────────────────── Datos en memoria y en archivo ─────────────────────────

const idiomas = new Map(); // idioma de cada usuario (se reinicia al apagar el bot)
const puntajes = new Map(); // puntaje del quiz de cada usuario (se reinicia al apagar el bot)

const ARCHIVO_VOTOS = path.join(__dirname, "votos.json");

function leerVotos() {
    try {
        return JSON.parse(fs.readFileSync(ARCHIVO_VOTOS, "utf8"));
    } catch {
        return {};
    }
}

function guardarVoto(userId, calificacion) {
    const votos = leerVotos();
    votos[userId] = calificacion; // un voto por persona; si vota otra vez, se actualiza
    fs.writeFileSync(ARCHIVO_VOTOS, JSON.stringify(votos, null, 2));
}

function obtenerIdioma(userId) {
    return idiomas.get(userId) ?? "es";
}

function alternarIdioma(userId) {
    const nuevo = obtenerIdioma(userId) === "es" ? "en" : "es";
    idiomas.set(userId, nuevo);
    return nuevo;
}

// ───────────────────────── Constructores de mensajes ─────────────────────────

function crearMenu(idioma) {
    const t = textos[idioma];
    const menu = new StringSelectMenuBuilder()
        .setCustomId("menu_principal")
        .setPlaceholder(t.placeholder)
        .addOptions(
            VISTAS.map((vista) => ({
                label: t.nombres[vista],
                description: t.descripciones[vista],
                value: vista,
            })),
        );
    return new ActionRowBuilder().addComponents(menu);
}

function crearBotones(vista, idioma) {
    const t = textos[idioma];
    const fila = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("nav:menu")
            .setLabel(t.botones.menu)
            .setEmoji("📋")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(vista === "menu"),
        new ButtonBuilder()
            .setCustomId(`lang:${vista}`)
            .setLabel(t.botones.idioma)
            .setEmoji("🌐")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("abrir:quiz")
            .setLabel("Quiz")
            .setEmoji("🧠")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("abrir:encuesta")
            .setLabel(t.botones.encuesta)
            .setEmoji("⭐")
            .setStyle(ButtonStyle.Secondary),
    );

    if (vista === "ubicacion") {
        fila.addComponents(
            new ButtonBuilder()
                .setLabel(t.botones.mapa)
                .setEmoji("📍")
                .setStyle(ButtonStyle.Link)
                .setURL(URL_MAPA),
        );
    }
    return fila;
}

function construirVista(vista, idioma) {
    const t = textos[idioma];
    const embed = new EmbedBuilder().setColor(COLOR).setFooter({ text: t.pie });

    if (vista === "menu") {
        embed.setTitle(t.menuTitulo).setDescription(t.menuDescripcion);
    } else {
        embed.setTitle(t.nombres[vista]).setDescription(t.respuestas[vista]);
    }

    return {
        embeds: [embed],
        components: [crearMenu(idioma), crearBotones(vista, idioma)],
    };
}

function construirPregunta(idioma) {
    const t = textos[idioma];
    const indice = Math.floor(Math.random() * preguntas.length);
    const pregunta = preguntas[indice];

    // Se mezclan las opciones; el botón guarda la posición original de cada una.
    const opciones = opcionesDe(pregunta, idioma)
        .map((texto, i) => ({ texto, i }))
        .sort(() => Math.random() - 0.5);

    const embed = new EmbedBuilder()
        .setColor(COLOR)
        .setTitle(t.quiz.titulo)
        .setDescription(pregunta.p[idioma])
        .setFooter({ text: t.pie });

    const fila = new ActionRowBuilder().addComponents(
        opciones.map((opcion) =>
            new ButtonBuilder()
                .setCustomId(`quiz:${indice}:${opcion.i}`)
                .setLabel(opcion.texto)
                .setStyle(ButtonStyle.Primary),
        ),
    );

    return { embeds: [embed], components: [fila] };
}

function resolverPregunta(userId, indice, elegida, idioma) {
    const t = textos[idioma];
    const pregunta = preguntas[indice];
    const acierto = elegida === pregunta.c;

    const puntaje = puntajes.get(userId) ?? { ok: 0, total: 0 };
    puntaje.total += 1;
    if (acierto) {
        puntaje.ok += 1;
    }
    puntajes.set(userId, puntaje);

    const correcta = opcionesDe(pregunta, idioma)[pregunta.c];
    const embed = new EmbedBuilder()
        .setColor(acierto ? 0x2ecc71 : 0xe74c3c)
        .setTitle(acierto ? t.quiz.correcto : t.quiz.incorrecto)
        .setDescription(
            [
                `**${pregunta.p[idioma]}**`,
                "",
                `${t.quiz.respuesta}: ${correcta}`,
                pregunta.e[idioma],
                "",
                `${t.quiz.puntaje}: ${puntaje.ok}/${puntaje.total}`,
            ].join("\n"),
        )
        .setFooter({ text: t.pie });

    const fila = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("quiz:next")
            .setLabel(t.quiz.otra)
            .setEmoji("🧠")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("nav:menu")
            .setLabel(t.botones.menu)
            .setEmoji("📋")
            .setStyle(ButtonStyle.Secondary),
    );

    return { embeds: [embed], components: [fila] };
}

function construirEncuesta(idioma) {
    const t = textos[idioma];
    const embed = new EmbedBuilder()
        .setColor(COLOR)
        .setTitle(t.encuesta.titulo)
        .setDescription(t.encuesta.descripcion)
        .setFooter({ text: t.pie });

    const fila = new ActionRowBuilder().addComponents(
        [1, 2, 3, 4, 5].map((n) =>
            new ButtonBuilder()
                .setCustomId(`encuesta:${n}`)
                .setLabel(String(n))
                .setEmoji("⭐")
                .setStyle(ButtonStyle.Secondary),
        ),
    );

    return { embeds: [embed], components: [fila] };
}

function construirGracias(calificacion, idioma) {
    const t = textos[idioma];
    const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setDescription(t.encuesta.gracias.replace("{n}", calificacion))
        .setFooter({ text: t.pie });

    const fila = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("nav:menu")
            .setLabel(t.botones.menu)
            .setEmoji("📋")
            .setStyle(ButtonStyle.Primary),
    );

    return { embeds: [embed], components: [fila] };
}

function construirResultados(idioma) {
    const t = textos[idioma];
    const votos = Object.values(leerVotos());
    const embed = new EmbedBuilder()
        .setColor(COLOR)
        .setTitle(t.resultados.titulo)
        .setFooter({ text: t.pie });

    if (votos.length === 0) {
        return { embeds: [embed.setDescription(t.resultados.vacio)] };
    }

    const promedio = votos.reduce((suma, n) => suma + n, 0) / votos.length;
    const lineas = [5, 4, 3, 2, 1].map((n) => {
        const cantidad = votos.filter((v) => v === n).length;
        const barra = "█".repeat(Math.round((cantidad / votos.length) * 10));
        return `${n} ⭐ ${barra} ${cantidad}`;
    });

    embed.setDescription(
        [
            `**${t.resultados.promedio}: ${promedio.toFixed(1)} / 5** (${votos.length} ${t.resultados.votos})`,
            "",
            ...lineas,
        ].join("\n"),
    );
    return { embeds: [embed] };
}

// ───────────────────────── Estado rotativo ─────────────────────────

const estados = [
    "CEBM BOT USE / TO USE",
    "CEBM Assistant | /menu",
    "Reta tu mente: /quiz",
    "Español / English: /idioma",
    "Danos tu opinión: /encuesta",
];
let posicionEstado = 0;

function rotarEstado() {
    client.user.setActivity(estados[posicionEstado], {
        type: ActivityType.Playing,
    });
    posicionEstado = (posicionEstado + 1) % estados.length;
}

// ───────────────────────── Eventos ─────────────────────────

client.once(Events.ClientReady, async () => {
    console.log(`Bot is online! as: ${client.user.tag}`);
    rotarEstado();
    setInterval(rotarEstado, 30 * 1000); // cambia cada 30 segundos

    try {
        await client.application.commands.set(commands);
        console.log("Slash commands registered.");
    } catch (error) {
        console.error("Failed to register slash commands:", error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    try {
        const userId = interaction.user.id;
        const idioma = obtenerIdioma(userId);

        // ── Menú desplegable ──
        if (interaction.isStringSelectMenu()) {
            if (
                interaction.customId === "menu_principal" &&
                VISTAS.includes(interaction.values[0])
            ) {
                await interaction.update(
                    construirVista(interaction.values[0], idioma),
                );
            }
            return;
        }

        // ── Botones ──
        if (interaction.isButton()) {
            const [tipo, a, b] = interaction.customId.split(":");

            if (tipo === "nav") {
                const vista = VISTAS.includes(a) ? a : "menu";
                await interaction.update(construirVista(vista, idioma));
            } else if (tipo === "lang") {
                const vista = VISTAS.includes(a) ? a : "menu";
                const nuevo = alternarIdioma(userId);
                await interaction.update(construirVista(vista, nuevo));
            } else if (tipo === "abrir") {
                const mensaje =
                    a === "quiz"
                        ? construirPregunta(idioma)
                        : construirEncuesta(idioma);
                await interaction.reply({ ...mensaje, flags: EFIMERO });
            } else if (tipo === "quiz") {
                if (a === "next") {
                    await interaction.update(construirPregunta(idioma));
                } else if (preguntas[Number(a)] !== undefined) {
                    await interaction.update(
                        resolverPregunta(userId, Number(a), Number(b), idioma),
                    );
                }
            } else if (tipo === "encuesta") {
                const calificacion = Number(a);
                if (calificacion >= 1 && calificacion <= 5) {
                    guardarVoto(userId, calificacion);
                    await interaction.update(construirGracias(calificacion, idioma));
                }
            }
            return;
        }

        // ── Comandos con / ──
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const comando = interaction.commandName;

        if (comando === "menu" || VISTAS.includes(comando)) {
            await interaction.reply(construirVista(comando, idioma));
        } else if (comando === "idioma") {
            const nuevo = alternarIdioma(userId);
            await interaction.reply(construirVista("menu", nuevo));
        } else if (comando === "quiz") {
            await interaction.reply({
                ...construirPregunta(idioma),
                flags: EFIMERO,
            });
        } else if (comando === "encuesta") {
            await interaction.reply({
                ...construirEncuesta(idioma),
                flags: EFIMERO,
            });
        } else if (comando === "resultados") {
            if (
                !interaction.memberPermissions?.has(
                    PermissionFlagsBits.ManageGuild,
                )
            ) {
                await interaction.reply({
                    content: textos[idioma].resultados.sinPermiso,
                    flags: EFIMERO,
                });
                return;
            }
            await interaction.reply({
                ...construirResultados(idioma),
                flags: EFIMERO,
            });
        }
    } catch (error) {
        console.error("Error handling interaction:", error);
    }
});

if (!process.env.DISCORD_TOKEN) {
    throw new Error("The DISCORD_TOKEN environment variable is required.");
}

client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error("Failed to log in to Discord:", error);
    process.exitCode = 1;
});