## Getting Started

Please install all dependencies

```
npm install
```

After that you can start the project in development mode within this terminal code:

```
npm run start:dev
```

## Setup env file

I provide a example .env.example file

```
MONGODB_URI=


JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
BUNNY_CDN_STORAGE_URL=
BUNNY_CDN_USERNAME=

R1_NODE_URL=

OPENAI_API_KEY=
```

```

```

## For secret keys

If you need to create secret key for jwt

```
openssl rand -hex 32  || 16
```
