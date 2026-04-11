export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    content: string;
    readTime: string;
    image: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "ansiedad-senal-alarma-cuerpo",
        title: "Ansiedad: Entendiendo la señal de alarma de tu mente y cuerpo",
        excerpt: "La ansiedad no es tu enemiga, es una señal mal calibrada. Descubre cómo tu sistema nervioso intenta protegerte y cómo puedes ayudarle a recuperar la calma.",
        author: "Psicólogos Ahora",
        date: "12 de Octubre, 2023",
        readTime: "6 min de lectura",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Es común despertar a mitad de la noche con el corazón a mil por hora, o sentir una opresión en el pecho antes de una reunión importante. Solemos catalogar a la ansiedad como el enemigo que debemos destruir o silenciar a toda costa. Sin embargo, desde la psicología clínica moderna, sabemos que la ansiedad es, en su núcleo, un esfuerzo extraordinariamente persistente (y equivocado) de tu sistema nervioso por mantenerte a salvo.</p>
            <h3>El Origen Evolutivo de la Ansiedad</h3>
            <p>Imagina que estás en la prehistoria. Si un ruido en los arbustos no te alertara, podrías ser devorado. Tu cerebro evolucionó para detectar amenazas y activar la respuesta de "lucha o huida", bombeando cortisol y adrenalina a tu torrente sanguíneo. El problema radica en que hoy las amenazas rara vez son tigres; suelen ser correos electrónicos inesperados de tu jefe, notificaciones en el teléfono o la incertidumbre financiera.</p>
            <p>El cuerpo no distingue entre un depredador físico y una amenaza emocional abstracta. Reacciona igual: tensión muscular, respiración superficial, hipervigilancia. Cuando se vuelve crónica, tu alarma contra incendios cerebral se queda atascada en la posición de "encendido".</p>
            <h3>Cómo Empezar a Desactivar la Alarma</h3>
            <p>La terapia cognitivo-conductual nos enseña que el primer paso no es evitar lo que nos da miedo, sino cambiar nuestra relación con esa sensación física. Cuando notamos que la ansiedad sube, nombrar la emoción ayuda a que la corteza prefrontal (la parte racional del cerebro) recupere el control: <em>"Esto que siento es ansiedad, mi cuerpo cree que estoy en peligro, pero ahora mismo estoy a salvo"</em>.</p>
            <p>La respiración diafragmática (inhalar profundamente inflando el estómago y exhalar lentamente) es el "freno de mano" biológico del cuerpo humano. Al hacerlo, estimulamos el nervio vago, enviando una señal química directa al cerebro para reducir las revoluciones y, eventualmente, enseñarle al cuerpo que no todo requiere un estado de guerra constante.</p>
        `
    },
    {
        id: "2",
        slug: "depresion-mas-alla-tristeza",
        title: "Depresión: Más allá de la tristeza, un acercamiento compasivo",
        excerpt: "A menudo se confunde la depresión clínica con la tristeza profunda. Exploramos la biología y psicología detrás del letargo emocional y cómo se cultiva la esperanza.",
        author: "Psicólogos Ahora",
        date: "28 de Septiembre, 2023",
        readTime: "8 min de lectura",
        image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Uno de los mayores malentendidos sobre la depresión es creer que es simplemente "estar muy triste". Quienes la padecen a menudo describen algo bastante distinto: una profunda sensación de vacío, una pesadez física invalidante o la incapacidad absoluta para sentir placer en aquellas cosas que antes encendían su mundo (lo que clínicamente llamamos anhedonia).</p>
            <h3>No es Falta de Voluntad</h3>
            <p>La sociedad suele exigirle a la persona deprimida que "ponga de su parte" o "vea el lado amable de la vida". Pero pedirle a alguien con depresión clínica que se alegre simplemente por voluntad pura es como pedirle a alguien con asma que simplemente respire profundo para curarse. La depresión involucra alteraciones estructurales y neuroquímicas en el cerebro, afectando áreas vitales como el hipocampo y la disponibilidad de neurotransmisores como la serotonina y la dopamina.</p>
            <h3>El Círculo Vicioso del Letargo</h3>
            <p>Cuando te deprimes, sientes poca o nula energía para interactuar socialmente o bañarte. Al aislarte y no realizar actividades, tu cerebro recibe menos estímulos gratificantes y tu estado de ánimo cae aún más, justificando que te aísles todavía más la semana siguiente. Es una trampa diseñada por la propia enfermedad estructural.</p>
            <h3>La Activación Conductual como Terapia</h3>
            <p>En el tratamiento psicológico, utilizamos técnicas como la Activación Conductual. En lugar de esperar a "tener ganas" para hacer algo (porque sabemos que esas ganas no llegarán espontáneamente), programamos pequeñas victorias: levantarse de la cama y quedarse en el sillón 10 minutos. Dar una breve caminata de 5 minutos, aunque no apetezca. La acción precede a la emoción, y no al revés. Poco a poco, esos micromovimientos comienzan a reactivar la maquinaria cerebral de la recompensa.</p>
        `
    },
    {
        id: "3",
        slug: "burnout-es-exigencia",
        title: "El síndrome de Burnout: Cuando dar el 100% te vacía por dentro",
        excerpt: "El agotamiento extremo no es señal de que debas esforzarte más, sino un alto clínico obligatorio. Entender los límites en la era de la sobreproducción.",
        author: "Psicólogos Ahora",
        date: "15 de Septiembre, 2023",
        readTime: "5 min de lectura",
        image: "https://images.unsplash.com/photo-1510007559981-817abeddf243?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Vivimos en una cultura que glorifica el exceso de trabajo y que en parte romantiza no dormir o estar siempre disponible. Sin embargo, nuestro cerebro tiene una batería muy finita. Cuando ignoramos las advertencias sutiles del cansancio, a menudo entramos en el territorio del Burnout (o Síndrome del Trabajador Quemado).</p>
            <h3>Síntomas Invisibles, Consecuencias Reales</h3>
            <p>El burnout rara vez comienza con un colapso dramático. Inicia con cinismo: comienzas a sentir resentimiento hacia tus clientes, pacientes o compañeros de oficina. De pronto, un correo electrónico ordinario se siente como un ataque insufrible. Pierdes la empatía, el insomnio se hace crónico y una fatiga gris y permanente se instala en tu cuerpo, incluso después de un fin de semana "descansando".</p>
            <p>La OMS lo reconoce como un fenómeno ocupacional y es vital no interpretarlo como debilidad. El burnout es, en esencia, un daño acumulativo por un ambiente que demanda más de lo que se nos permite reparar física y emocionalmente.</p>
            <h3>Restaurar el Sentido del Límite</h3>
            <p>El tratamiento no siempre pasa por renunciar o cambiar de carrera de golpe, sino por instaurar fronteras rígidas. Para sanar, necesitamos aprender el idioma de los límites: desactivar notificaciones después de cierta hora, abandonar el perfeccionismo tóxico, o comunicar a nuestro entorno cuándo nuestra batería social o laboral está drenada.</p>
            <p>El verdadero autocuidado no siempre es tomar un baño de burbujas; frecuentemente es la dolorosa valentía de decir "no puedo encargarme de eso hoy". Sanar del burnout requiere entender que no eres una máquina de productividad, sino un ser humano merecedor de descanso sin necesidad de justificarlo con el sudor previo.</p>
        `
    },
    {
        id: "4",
        slug: "terapia-de-pareja-preventiva",
        title: "Terapia de Pareja Mantenimiento: Por qué no deberías esperar al colapso",
        excerpt: "Asociamos la terapia de pareja con el inminente divorcio, pero las parejas más exitosas la usan de manera preventiva para afinar dinámicas y la empatía mutua.",
        author: "Psicólogos Ahora",
        date: "05 de Septiembre, 2023",
        readTime: "7 min de lectura",
        image: "https://images.unsplash.com/photo-1498059670691-13788be4fbf0?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Consideramos prudente la revisión anual de un automóvil, pero cuando se trata de relaciones sentimentales a largo plazo, creemos que ir a un profesional sólo es necesario si el motor ya explotó. La realidad clínica nos dice que la mayoría de las parejas esperan en promedio 6 años de problemas severos antes de acudir a su primera sesión de terapia.</p>
            <h3>Los 4 Jinetes del Apocalipsis Relacional</h3>
            <p>El Dr. John Gottman, pionero en la investigación relacional, descubrió cuatro patrones destructivos que predicen la ruptura con alta precisión: las críticas destructivas, el desprecio, la actitud defensiva y la actitud evasiva ("ley del hielo"). Estos hábitos, si no se interceptan, pavimentan el camino hacia el aislamiento y el odio silencioso dentro del matrimonio o el noviazgo.</p>
            <p>El papel preventivo del terapeuta de parejas no es determinar quién "tiene la razón", sino revelar al "tercer paciente": la relación. Se exploran las heridas de apego que cada miembro carga de su juventud y cómo chocan mutuamente. Por ejemplo, el miedo al abandono de uno a menudo desencadena el miedo ser invadido emocionalmente del otro, creando una persecución ansiosa donde ambos pierden.</p>
            <h3>Un Espacio de Traducción</h3>
            <p>La terapia preventiva otorga a las parejas un vocabulario emocional renovado y un diccionario para entender el idioma afectivo del otro. Aprender tácticas concretas para "suavizar el tono del inicio de la discusión" o saber tomar pausas conscientes cuando el ritmo cardiaco supera los 100 LPM, es lo que diferencia a una pareja capaz de soportar tormentas a una que puede ser destruida en la primera noche turbulenta.</p>
        `
    },
    {
        id: "5",
        slug: "heridas-infancia-eco-adulto",
        title: "Trauma y Sanación: Cómo el ayer condiciona silenciosamente el hoy",
        excerpt: "No todos los traumas se ven a simple vista. Comprender el 'trauma complejo' (las pequeñas heridas acumulativas en la infancia) revela cómo operamos en la adultez.",
        author: "Psicólogos Ahora",
        date: "22 de Agosto, 2023",
        readTime: "9 min de lectura",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Cuando escuchamos la palabra "trauma", la cultura pop nos remite usualmente al Estrés Postraumático (TEPT) típico de catástrofes bélicas, físicos o eventos masivos y singulares que dividen la vida en un "antes y un después". Pero existe en psicología el llamado Trauma Complejo, esa telaraña sutil tejida a través de rechazos, negligencia emocional, gritos, exigencias desmedidas o afectos inconstantes por parte de los cuidadores durante el desarrollo primario.</p>
            <h3>El Cuerpo Lleva la Cuenta</h3>
            <p>El cerebro de un niño está en construcción a un ritmo frenético. Su principal vía de desarrollo viene de "conectar" y hacer sinergia emocional con sus progenitores. Si esa conexión no es confiable, si está caracterizada por ráfagas de vergüenza y frialdad o castigo impredecible, el cerebro asimila que las relaciones son inherentemente inseguras, grabando estas conclusiones no como ideas (porque quizá preexistan el lenguaje), sino como reacciones instintivas corporales viscerales.</p>
            <p>Las personas con trauma complejo o relacional sienten en su adultez un miedo inexplicable al rechazo, se disocian si la intimidad se profundiza, o adoptan patrones de complacencia ('people-pleasing') de forma defensiva; agradar al otro no viene del deseo sincero, sino del mandato biológico para asegurar supervivencia apaciguando presas peligrosas.</p>
            <h3>La Terapia como Reescribir la Mente</h3>
            <p>Trabajamos desde distintos ángulos como EMDR y enfoques compasivos, entendiendo que curar el trauma relacional toma tiempo y que se experimenta principalmente creando, por primera vez, un lazo estable y profundamente respetuoso con una figura exterior: su terapeuta. Este vínculo seguro en el despacho sirve de laboratorio donde el paciente aprende, tras muchos ensayos y errores clementes, que el acercamiento al otro no tiene que concluir invariablemente en extinción u olvido. Eso se expande, y reconfigura su concepción completa del universo social.</p>
        `
    }
];
