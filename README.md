# Book Cover Editor with Vue 3 and Vite

This project is a simple book cover editor built with Vue 3 and Vite. It allows users to select a book from the NY Times Books API, import a cover image, add textboxes for the book title and author's name, customize the textboxes (font size, text color, letter spacing), preview the edited image, and download the final cover.

## Features

- Choose a book from the NY Times Books API.
- Import a cover image from the local computer.
- Automatically populate textboxes with the book title and author's name.
- Customize textboxes individually (font size, text color, letter spacing).
- Preview the edited cover image.
- Download the edited cover image.

## Example User Scenario

1. Choose the Little Prince book from the dropdown.
2. Import a cover image.
3. See the book name and author name automatically added as textboxes.
4. Click the Name textbox and change the color to Orange, increase the font size, and drag it to the center.
5. Click the Author textbox and change the color to White, drag it to the center.
6. Click Save, see the preview.
7. Go back to the Edit page to make other changes, increase the Author text’s font.

## Installation

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Dependencies

- Vue 3
- Vite
- Axios (for API requests)
- html2canvas (for capturing the canvas)
- free-transform

