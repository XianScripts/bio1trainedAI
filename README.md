# Chapter 2 Chatbot

A Next.js-based chatbot that answers questions about Chapter 2 of a Biology course, using retrieval-based question-answering. 

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Embedding Script (Optional)](#embedding-script-optional)
- [Usage](#usage)
- [Deployment](#deployment)
- [Acknowledgments](#acknowledgments)

---

## Overview
This project creates a web-based AI chatbot restricted to the content of a specific “Chapter 2.” It uses:
- A local embedding index (`chapter2-embeddings.json`) to store chunked text data.
- An OpenAI model (GPT-3.5 or GPT-4) to answer queries *only* from the provided text.

### Live Demo
Deployed on Vercel: [**Chapter 2 Bot**](https://your-vercel-url.example.com)

---

## Features
- **Retrieval-based Q&A**: Embeds the chapter text and fetches the most relevant chunk for answers.
- **Next.js Pages Router**: Simplified structure with `pages/index.tsx` and `pages/api/ask.ts`.
- **SoftChalk Integration**: Provide an iframe link or a direct link for students to use from within SoftChalk lessons.
- **Environment Variables**: Keep your OpenAI API key in a `.env` file, never in source control.

---

## Tech Stack
- **Next.js 13** (Pages Router)
- **React 18**
- **OpenAI** (for embeddings and chat completions)
- **TypeScript** (optional, can be used for type safety)

---

## Setup Instructions

1. **Clone** the repo:
   ```bash
   git clone https://github.com/<your-username>/chapter2-bot.git
   cd chapter2-bot
