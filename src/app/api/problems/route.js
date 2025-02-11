import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    const problemsDir = path.join(process.cwd(), 'problems');
    const files = await fs.readdir(problemsDir);

    const problems = files.map((file, index) => ({
        id: index + 1,
        fileName: file,
        title: path.parse(file).name,
        language: file.split('.').pop(),
        difficulty: 'medium'
    }));

    return NextResponse.json(problems);
}