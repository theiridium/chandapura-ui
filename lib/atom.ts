import { atom } from 'jotai'

export const searchResult = atom({});
export const searchText = atom("");
export const categories = atom<any>([]);
export const amenities = atom<any>([]);
export const areas = atom<any>([]);
export const IsUserLogged = atom(false);