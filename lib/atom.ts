import { atom } from 'jotai'

export const searchResult = atom({});
export const searchText = atom("");
export const categories = atom<any>([]);
export const REAmenities = atom<any>([]);
export const PGAmenities = atom<any>([]);
export const PlotAmenities = atom<any>([]);
export const areas = atom<any>([]);
export const classifiedCategories = atom<any>([]);
export const languages = atom<any>([]);
export const IsUserLogged = atom(false);