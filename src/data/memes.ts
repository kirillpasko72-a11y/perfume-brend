import type { UiLang } from "../types";

interface MemePack {
  praise: string[];
  roast: string[];
  threats: string[];
  loading: string[];
  examFail: string[];
  examPass: string[];
  memeOfDay: { emoji: string; top: string; bottom: string }[];
}

const ru: MemePack = {
  praise: [
    "ГИГАМОЗГ АКТИВИРОВАН 🧠",
    "Так, спокойно, у нас тут гений",
    "Гусь горд. Гусь плачет. 🪿😭",
    "+100 к социальному рейтингу",
    "Ты это сам? Без гугла?? Уважение",
    "Осёл нервно убирает лазеры",
    "МАМА, Я В ТЕЛЕВИЗОРЕ",
    "Ещё пара таких — и можно в Госдуму переводчиком",
    "Нейроны построились и аплодируют",
    "Дуолинго звонил, завидует",
  ],
  roast: [
    "Это было больно даже читать",
    "Осёл выехал. Не благодари.",
    "Словарь плачет в углу",
    "Твой мозг сейчас: 🗿",
    "Даже голубь бы ответил правильно",
    "Минус жизнь. Плюс жизненный урок.",
    "Гусь записал это в блокнотик 📓🔪",
    "Ошибка 404: знания не найдены",
    "Ну… зато уверенно нажал",
    "Препод в универе уже чувствует твою энергию",
  ],
  threats: [
    "Пропустишь урок — гусь пропустит тебя. Через себя.",
    "Мы знаем, где живёт твоя мотивация.",
    "Сделай урок. Осёл уже заряжает лазеры.",
    "Твой стрик плачет. Гусь точит нож.",
    "Один урок в день. Или один гусь в ночь.",
    "Не заставляй нас отправлять капибару. Она разочаруется.",
    "Учить слова — 5 минут. Прятаться от гуся — вся жизнь.",
    "Гусь видел твою статистику. Гусь недоволен.",
  ],
  loading: [
    "Кормим гуся…",
    "Заряжаем лазеры осла…",
    "Точим нож… в образовательных целях…",
    "Переводим мемы на 4 языка…",
    "Прячем кнопку «пропустить урок»…",
    "Убеждаем капибару поработать…",
    "Загружаем угрозы… готово ☑",
  ],
  examFail: [
    "F. Просто F.",
    "Экзамен: 1 — Ты: 0",
    "Гусь уже в пути. Собирай вещи.",
    "Пересдача, боец. Осёл будет ждать.",
  ],
  examPass: [
    "АБСОЛЮТНАЯ ПОБЕДА 🏆",
    "Гусь снял нож с предохранителя. Из уважения.",
    "Сертифицированный полиглот подъехал",
    "Осёл выключил лазеры и зааплодировал",
  ],
  memeOfDay: [
    { emoji: "🪿🔪", top: "Ты: пропустил один урок", bottom: "Гусь: ничего личного" },
    { emoji: "🫏⚡", top: "Осёл увидел твой ответ", bottom: "Лазеры: уже тёплые" },
    { emoji: "🧠📉", top: "Мой мозг на экзамене", bottom: "«собака» это... э-э-э..." },
    { emoji: "🐸☕", top: "Учу испанский 3-й день", bottom: "Уже считаю себя носителем" },
    { emoji: "🗿🗿", top: "Я после 2 правильных ответов", bottom: "Полиглот. Легенда. Мем." },
    { emoji: "🔥📚", top: "Стрик 3 дня", bottom: "Личность полностью изменилась" },
  ],
};

const en: MemePack = {
  praise: [
    "GIGABRAIN ACTIVATED 🧠",
    "Okay calm down, we've got a genius here",
    "The goose is proud. The goose is crying. 🪿😭",
    "+100 social credit",
    "You did that? Without Google?? Respect",
    "The donkey nervously holsters his lasers",
    "MOM, I'M ON TV",
    "A few more and you can legally call yourself a polyglot",
    "Your neurons are doing a standing ovation",
    "Duolingo just called. It's jealous.",
  ],
  roast: [
    "That was painful to even read",
    "The donkey has been dispatched. You're welcome.",
    "The dictionary is crying in the corner",
    "Your brain right now: 🗿",
    "Even a pigeon would've gotten that one",
    "Minus one heart. Plus one life lesson.",
    "The goose wrote that down in his little notebook 📓🔪",
    "Error 404: knowledge not found",
    "Well… at least you clicked confidently",
    "Your future teacher just felt a disturbance",
  ],
  threats: [
    "Skip a lesson and the goose will skip YOU.",
    "We know where your motivation lives.",
    "Do the lesson. The donkey is already charging his lasers.",
    "Your streak is crying. The goose is sharpening the knife.",
    "One lesson a day. Or one goose a night.",
    "Don't make us send the capybara. She'll be disappointed in you.",
    "Learning words: 5 minutes. Hiding from the goose: a lifetime.",
    "The goose saw your stats. The goose is not pleased.",
  ],
  loading: [
    "Feeding the goose…",
    "Charging the donkey's lasers…",
    "Sharpening the knife… for educational purposes…",
    "Translating memes into 4 languages…",
    "Hiding the “skip lesson” button…",
    "Convincing the capybara to do some work…",
    "Loading threats… done ☑",
  ],
  examFail: [
    "F. Just F.",
    "Exam: 1 — You: 0",
    "The goose is on his way. Pack your things.",
    "Retake it, soldier. The donkey will be waiting.",
  ],
  examPass: [
    "ABSOLUTE VICTORY 🏆",
    "The goose put the safety back on the knife. Out of respect.",
    "Certified polyglot has entered the chat",
    "The donkey turned off his lasers and applauded",
  ],
  memeOfDay: [
    { emoji: "🪿🔪", top: "You: missed one lesson", bottom: "The goose: nothing personal" },
    { emoji: "🫏⚡", top: "The donkey saw your answer", bottom: "Lasers: already warm" },
    { emoji: "🧠📉", top: "My brain during the exam", bottom: "\"dog\" is... uhh..." },
    { emoji: "🐸☕", top: "Day 3 of learning Spanish", bottom: "Already consider myself a native" },
    { emoji: "🗿🗿", top: "Me after 2 correct answers", bottom: "Polyglot. Legend. Meme." },
    { emoji: "🔥📚", top: "3 day streak", bottom: "Personality completely changed" },
  ],
};

const packs: Record<UiLang, MemePack> = { ru, en };

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function memes(lang: UiLang): MemePack {
  return packs[lang];
}

/** Deterministic meme of the day — same all day, changes daily. */
export function memeOfTheDay(lang: UiLang) {
  const list = packs[lang].memeOfDay;
  const day = Math.floor(Date.now() / 86_400_000);
  return list[day % list.length];
}
