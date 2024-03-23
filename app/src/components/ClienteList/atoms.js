"use client";
import { atom } from 'recoil';

export const pageState = atom({
  key: 'pageState',
  default: 1,
});

export const limitState = atom({
  key: 'limitState',
  default: 10,
});