# RAWGO

![GitHub package.json version](https://img.shields.io/github/package-json/v/dankerow/rawgo-api)
![GitHub License](https://img.shields.io/github/license/dankerow/rawgo-api)

## Description

**RAWGO** is a powerful and flexible API designed to simplify the creation of memes and the application of various filters to images. Built on Node.js, it leverages modern libraries and tools to provide a robust solution for image manipulation.

## Features

- **Meme Generation**: Easily create memes with customizable options.
- **Image Filters**: Apply a wide range of filters to images, including blur, grayscale, sepia, and more.
- **Performance Optimized**: Utilizes worker threads to handle image processing efficiently.
- **Extensible**: Designed with modularity in mind, allowing for easy expansion and customization.

## Getting Started

### Prerequisites

- Node.js (>=20.0.0)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dankerow/rawgo-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rawgo-api
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Configuration

Copy the `.env.example` file to `.env` and adjust the configuration settings according to your environment.

```dotenv
NODE_ENV=development
WORKERS_NUMBER=1
PORT=3000
```

### Running the Application

- To start the application in development mode:
  ```bash
  pnpm run dev
  ```
- To build the application:
  ```bash
  pnpm run build
  ```
- To start the application in production mode:
  ```bash
  pnpm start
  ```

## Usage

After starting the application, you can use HTTP requests to interact with the API.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the LGPL-3.0-only License - see the LICENSE file for details.
