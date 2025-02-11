import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req, { params }) {
    try {
        const filePath = path.join(process.cwd(), 'problems', params.file);
        const fileContent = await fs.readFile(filePath, 'utf-8');

        const analysis = {
            structure: "이 코드는 기본적인 알고리즘 구현을 보여주는 예제입니다.",
            suggestions: "변수명을 더 명확하게 지정하고, 주석을 추가하면 좋을 것 같습니다.",
            keyPoints: [
                "알고리즘의 시간 복잡도는 O(n²)입니다.",
                "중첩 반복문을 사용하여 구현되었습니다.",
                "코드의 가독성이 좋은 편입니다."
            ]
        };

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("AI 분석 실패:", error);
        return NextResponse.json({ error: "AI 분석에 실패했습니다." }, { status: 500 });
    }
}