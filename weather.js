#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { getIcon, getWeather } from "./services/api.service.js";
import {
  printHelp,
  printSuccess,
  printError,
  printWeather,
} from "./services/log.service.js";
import {
  getKeyValue,
  saveKeyValue,
  TOKEN_DICTIONARY,
} from "./services/storage.service.js";

const saveToken = async (token) => {
  if (!token.length) {
    printError("Токен не указан");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess("Токен сохранён");
  } catch (e) {
    printError(e.message);
  }
};

const saveCity = async (city) => {
  if (!city.length) {
    printError("Город не указан");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city);
    printSuccess("Город сохранён");
  } catch (e) {
    printError(e.message);
  }
};

const saveLang = async (lang) => {
  if (!lang.length) {
    printError("Язык не указан");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.lang, lang);
    printSuccess("Язык сохранён");
  } catch (e) {
    printError(e.message);
  }
};

const getForcast = async () => {
  try {
    const cities = (await getKeyValue(TOKEN_DICTIONARY.city)) ?? ["moscow"];
    for (const city of cities) {
      const weather = await getWeather(city);
      printWeather(weather, getIcon(weather.weather[0].icon));
    }
  } catch (e) {
    if (e?.response?.status === 404) {
      printError("Неверно указан город");
    } else if (e?.response?.status === 401) {
      printError("Неверно указан токен");
    } else {
      printError(e.message);
    }
  }
};

console.log("!");

const initCLI = () => {
  const args = getArgs(process.argv);
  if (args.h) {
    return printHelp();
  }
  if (args.s) {
    // console.log(args);
    return saveCity(args.s);
  }
  if (args.t) {
    return saveToken(args.t);
  }
  if (args.l) {
    return saveLang(args.l);
  }
  return getForcast();
};

initCLI();
