import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const problemsDir = path.join(process.cwd(), "problems");

// **파일 내용 불러오기 (GET)**
export async function GET(req, context) {
    try {
        const params = await context.params; // ✅ `await`으로 감싸서 가져오기
        if (!params || !params.file) {
            return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
        }

        const filePath = path.join(problemsDir, params.file);
        const content = await fs.readFile(filePath, "utf-8");

        return new NextResponse(content);
    } catch (error) {
        return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
    }
}

// **파일 저장하기 (POST)**
export async function POST(req, context) {
    try {
        const params = await context.params; // ✅ `await`으로 감싸서 가져오기
        if (!params || !params.file) {
            return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
        }

        const filePath = path.join(problemsDir, params.file);
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "내용이 비어 있습니다." }, { status: 400 });
        }

        await fs.writeFile(filePath, content, "utf-8");
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "파일 저장 실패!" }, { status: 500 });
    }
}