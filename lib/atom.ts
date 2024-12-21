import { atom } from 'jotai'

export const searchResult = atom({});
export const searchText = atom("");
export const categories = atom<any>([]);
export const REamenities = atom<any>([]);
export const PGamenities = atom<any>([]);
export const areas = atom<any>([]);
export const classifiedCategories = atom<any>([]);
export const IsUserLogged = atom(false);