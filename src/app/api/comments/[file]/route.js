import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const commentsDir = path.join(process.cwd(), 'comments');

export async function GET(req, { params }) {
    try {
        const filePath = path.join(commentsDir, `${params.file}.json`);
        const comments = await fs.readFile(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(comments));
    } catch {
        return NextResponse.json([]);
    }
}

export async function POST(req, { params }) {
    const comments = await req.json();
    await fs.mkdir(commentsDir, { recursive: true });
    await fs.writeFile(path.join(commentsDir, `${params.file}.json`), JSON.stringify(comments, null, 2));
    return NextResponse.json({ success: true });
}