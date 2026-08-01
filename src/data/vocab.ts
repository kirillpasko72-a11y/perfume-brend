import type { LangCode } from "../types";

export interface VocabEntry {
  id: string;
  emoji: string;
  words: Record<LangCode, string>;
}

export interface Unit {
  id: string;
  icon: string;
  title: Record<"ru" | "en", string>;
  entries: VocabEntry[];
}

const w = (
  id: string,
  emoji: string,
  ru: string,
  en: string,
  es: string,
  de: string
): VocabEntry => ({ id, emoji, words: { ru, en, es, de } });

export const UNITS: Unit[] = [
  {
    id: "basics",
    icon: "🐣",
    title: { ru: "База", en: "Basics" },
    entries: [
      w("hello", "👋", "привет", "hello", "hola", "hallo"),
      w("thanks", "🙏", "спасибо", "thank you", "gracias", "danke"),
      w("yes", "✅", "да", "yes", "sí", "ja"),
      w("no", "❌", "нет", "no", "no", "nein"),
      w("dog", "🐶", "собака", "dog", "perro", "Hund"),
      w("cat", "🐱", "кошка", "cat", "gato", "Katze"),
      w("goose", "🪿", "гусь", "goose", "ganso", "Gans"),
      w("donkey", "🫏", "осёл", "donkey", "burro", "Esel"),
      w("water", "💧", "вода", "water", "agua", "Wasser"),
      w("house", "🏠", "дом", "house", "casa", "Haus"),
      w("friend", "🫂", "друг", "friend", "amigo", "Freund"),
      w("love", "❤️", "любовь", "love", "amor", "Liebe"),
    ],
  },
  {
    id: "food",
    icon: "🍕",
    title: { ru: "Еда", en: "Food" },
    entries: [
      w("bread", "🍞", "хлеб", "bread", "pan", "Brot"),
      w("milk", "🥛", "молоко", "milk", "leche", "Milch"),
      w("pizza", "🍕", "пицца", "pizza", "pizza", "Pizza"),
      w("apple", "🍎", "яблоко", "apple", "manzana", "Apfel"),
      w("coffee", "☕", "кофе", "coffee", "café", "Kaffee"),
      w("tea", "🍵", "чай", "tea", "té", "Tee"),
      w("cheese", "🧀", "сыр", "cheese", "queso", "Käse"),
      w("egg", "🥚", "яйцо", "egg", "huevo", "Ei"),
      w("banana", "🍌", "банан", "banana", "plátano", "Banane"),
      w("soup", "🍲", "суп", "soup", "sopa", "Suppe"),
      w("cake", "🍰", "торт", "cake", "pastel", "Kuchen"),
      w("potato", "🥔", "картошка", "potato", "patata", "Kartoffel"),
    ],
  },
  {
    id: "chaos",
    icon: "🔥",
    title: { ru: "Хаос", en: "Chaos" },
    entries: [
      w("fire", "🔥", "огонь", "fire", "fuego", "Feuer"),
      w("dragon", "🐉", "дракон", "dragon", "dragón", "Drache"),
      w("rocket", "🚀", "ракета", "rocket", "cohete", "Rakete"),
      w("brain", "🧠", "мозг", "brain", "cerebro", "Gehirn"),
      w("ghost", "👻", "призрак", "ghost", "fantasma", "Geist"),
      w("laser", "⚡", "лазер", "laser", "láser", "Laser"),
      w("moon", "🌙", "луна", "moon", "luna", "Mond"),
      w("wizard", "🧙", "волшебник", "wizard", "mago", "Zauberer"),
      w("robot", "🤖", "робот", "robot", "robot", "Roboter"),
      w("dance", "🕺", "танец", "dance", "baile", "Tanz"),
      w("knife", "🔪", "нож", "knife", "cuchillo", "Messer"),
      w("victory", "🏆", "победа", "victory", "victoria", "Sieg"),
    ],
  },
];

export const LESSONS_PER_UNIT = 3;
export const QUESTIONS_PER_LESSON = 6;
export const EXAM_QUESTIONS = 10;
export const EXAM_PASS = 7;
export const EXAM_SECONDS = 15;

export const LANG_META: Record<
  LangCode,
  { flag: string; name: Record<"ru" | "en", string> }
> = {
  ru: { flag: "🇷🇺", name: { ru: "Русский", en: "Russian" } },
  en: { flag: "🇬🇧", name: { ru: "Английский", en: "English" } },
  es: { flag: "🇪🇸", name: { ru: "Испанский", en: "Spanish" } },
  de: { flag: "🇩🇪", name: { ru: "Немецкий", en: "German" } },
};
