import { atom } from 'jotai'

export const searchResult = atom({});
export const searchText = atom("");
export const categories = atom<any>([]);
export const locations = atom<any>([]);
export const IsUserLogged = atom(false);