import { atom, selector } from "recoil"
import { parse } from "./api"

export const questionState = atom({
  key: 'queryState',
  default: '',
});

export const parseQuery = selector({
  key: 'parseQuery',
  get: async ({get}) => {
    const question = get(questionState)
    return parse(question)
  }
});
