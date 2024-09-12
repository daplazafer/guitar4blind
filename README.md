# guitar4blind

guitar4blind is a web application designed to help visually impaired guitar players by converting guitar tablature into spoken instructions. The user can paste guitar tablature into a text box, and the application will read the notes aloud, string by string, fret by fret, in the selected language.

## Example of a Guitar Tab:

```txt
e|-------------------------|------------------------------------|
B|-15-13-12----13-12-------|----------12-(12)12-12-12-12-12-12--|
G|----------14-------14-12-|-11-12-14---------------------------|
D|-------------------------|------------------------------------|
A|-------------------------|------------------------------------|
E|-------------------------|------------------------------------|
```

The application will read this tab in the selected language. For example, it will say:

```txt
string 2 fret 15;
then, string 2 fret 13;
then, string 2 fret 12;
then, string 3 fret 14;
```

## Features:

- Convert any standard guitar tablature to spoken instructions.
- Multiple language support for speech synthesis.
- Easy-to-use interface for pasting tablature.

## Running the Project Locally

### With Makefile:

You can also use the provided Makefile to manage the project. To install dependencies and run the server:

#### 1. Install dependencies:

```bash
make install
```

#### 2. Run the application:

```bash
make start
```

### With Bun:

#### 1. Install dependencies:

```bash
bun install
```

#### 2. Run the application:

```bash
bun run
```

This project was created using bun init with bun v1.1.27. Bun is a fast all-in-one JavaScript runtime.

## Deployment

Once the application is ready, the plan is to deploy it using GitHub Pages. Stay tuned for the deployment link in future updates.
