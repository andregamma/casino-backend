import { NestApplication } from '../utils/NestApplication';

export const App = (value) => {
  const Getted = NestApplication.getInstance().get().get(value);
  console.log(typeof Getted);
  return Getted ? new Getted() : undefined;
};
