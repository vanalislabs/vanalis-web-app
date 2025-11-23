# Vanalis WWeb App

This dApp was created using `@mysten/create-dapp` that sets up a basic React
Client dApp using the following tools:

- [React](https://react.dev/) as the UI framework
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [Vite](https://vitejs.dev/) for build tooling
- [TailwindCSS](http://tailwindcss.com/) css framework
- [ESLint](https://eslint.org/)
- [`@mysten/dapp-kit`](https://sdk.mystenlabs.com/dapp-kit) for connecting to
  wallets and loading data
- [yarn](https://yarnpkg.com/) for package management

## Starting your dApp

Copy .env.example to .env (fill the environment, make sure jwt secret same with backend jwt secret)
```bash
cp .env.example .env
```

To install dependencies you can run

```bash
yarn install
```

To start your dApp in development mode run

```bash
yarn dev
```

## Building

To build your app for deployment you can run

```bash
yarn build
```
