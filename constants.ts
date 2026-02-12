import { ModelMap, Translations } from './types';

export const MODELS: ModelMap = {
  priscila: "https://t.me/teste1",
  leticia : "https://t.me/teste2"
};

export const ADMIN_ROUTE = "/paineladmin";

export const DEFAULT_GIF = "https://i.imgur.com/w55irUi.gif";

export const TEXTS: Translations = {
  pt: {
    title: "SIGA O TUTORIAL",
    footer: "ABRA NO NAVEGADOR PARA CONTINUAR",
    btn: "ACESSAR AGORA",
    steps: [
      "1) TOQUE NOS <span class='text-purple-500 font-extrabold'>TRÊS PONTINHOS</span> (SUPERIOR)",
      "2) ESCOLHA <span class='text-purple-500 font-extrabold'>\"ABRIR NO NAVEGADOR\"</span>",
      "3) O BOTÃO FICARÁ <span class='text-purple-500 font-extrabold'>ROXO AUTOMATICAMENTE</span>"
    ]
  },
  es: {
    title: "SIGA EL TUTORIAL",
    footer: "ABRIR EN EL NAVEGADOR PARA CONTINUAR",
    btn: "ACCEDER AHORA",
    steps: [
      "1) TOQUE LOS <span class='text-purple-500 font-extrabold'>TRES PUNTOS</span> (SUPERIOR)",
      "2) ELIJA <span class='text-purple-500 font-extrabold'>\"ABRIR EN EL NAVEGADOR\"</span>",
      "3) EL BOTÓN SE VOLVERÁ <span class='text-purple-500 font-extrabold'>PÚRPURA AUTOMÁTICAMENTE</span>"
    ]
  },
  en: {
    title: "FOLLOW THE TUTORIAL",
    footer: "OPEN IN BROWSER TO CONTINUE",
    btn: "ACCESS NOW",
    steps: [
      "1) TAP THE <span class='text-purple-500 font-extrabold'>THREE DOTS</span> (TOP CORNER)",
      "2) CHOOSE <span class='text-purple-500 font-extrabold'>\"OPEN IN BROWSER\"</span>",
      "3) THE BUTTON WILL TURN <span class='text-purple-500 font-extrabold'>PURPLE AUTOMATICALLY</span>"
    ]
  }
};
