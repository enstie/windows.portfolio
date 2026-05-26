# Justice Entsie's Portfolio

This is my personal portfolio, built to look and feel like Windows XP running in your browser. Yes, the whole thing. Icons on the desktop, draggable windows, a taskbar, a start menu, the works. I wanted to do something a little different instead of the usual scrolling single-page layout that everyone has.

## What's inside

When you land on the site you get a proper XP desktop with the Bliss wallpaper and a bunch of icons you can actually move around. Everything opens in its own window, just like you'd expect.

Here's what you can open:

- **My Portfolio folder** contains four apps about me. There's a resume viewer with my work history, education and skills, a project gallery showing things I've built, a terminal that runs a fake bio script, and a certificates page that pulls in my GitHub stats.
- **Internet Explorer** is a real browser inside the browser. You can search the web with DuckDuckGo and visit actual websites. It proxies requests server-side so you don't run into CORS issues.
- **Windows Media Player** plays a full Passenger playlist. Songs like Let Her Go, Catch in the Dark, Long Road and more. The visualizer animates while the music plays and you can toggle to the actual video if you want.
- **Minesweeper** works exactly as you'd expect.
- **SaaS Hub** is a dashboard that shows some of the tools and services I work with.
- **Control Panel** lets you change the wallpaper and the colour theme of the windows.

## How it's built

The site is a React app using Vite. The XP look is all vanilla CSS, no component library. Every window is draggable and resizable. The desktop icons snap to a grid when you drop them.

Performance was a big focus. Each app is lazy loaded so the initial bundle is tiny. You only download code for a window when you actually open it.

The browser proxy runs through Vite's dev server middleware so any site can be fetched without CORS errors.

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Built by

Justice Entsie. Full-stack developer based in Accra, Ghana. You can reach me at Entise4561@gmail.com or find me on GitHub at github.com/entsie.
