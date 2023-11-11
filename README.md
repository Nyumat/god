## God - Elevate Your Code, Embrace the Divine

God is a web service that allows you to execute code in a variety of languages. I've [already done this in Golang as a proof of concept](https://github.com/nyumat/titan) but I wanted to try it in TypeScript for funsies. 🤩 

It works by creating a series of Docker containers that are spun up when the server starts, and torn down when the server connection closes. The containers and sanbox are created using [Dockerode](https://github.com/apocas/dockerode). 

[PocketBase](
https://pocketbase.io/) (a database as a service) is used for storing the metadata.

You'll need:

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [PocketBase](https://pocketbase.io/)

## Getting Started

1. Clone this repository

````bash
git clone https://github.com/Nyumat/god.git
````

2. Create a directory/file at `/core/config/.env.local`

```
PORT=
POCKETBASE_URL=
USERNAME=
PASSWORD=
```

3. Install the dependencies
```
cd core/src
npm install
```

4. Start the development server
```
npm run dev
```

**Note:** You can see the linting and formating scripts in `package.json` under `lint` and `format`

## API (WIP)

### POST /api/v1/execute

Execute code in a given language.

#### Request Body

```json
{
  "language": "javascript",
  "code": "console.log('Hello, World!')"
}
````

#### Response Body

```json
{
  "language": "javascript",
  "code": "console.log('Hello, World!')",
  "output": "Hello, World!"
}
```

### GET /api/v1/languages

Get a list of supported languages.

#### Response Body

```json
[
  {
    "name": "javascript",
    "version": "14.15.4"
  },
  {
    "name": "python",
    "version": "3.9.1"
  }
]
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.