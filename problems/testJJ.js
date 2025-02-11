"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { dracula } from 'thememirror';

export default function ProblemDetailPage() {
    const { file } = useParams();
    const [code, setCode] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false); // AI 분석 결과 표시 여부

    const fileExtension = file.split(".").pop();
    const languageExtensions = {
        py: python(),
        js: javascript(),
        java: java(),
        cpp: cpp(),
        html: html(),
        css: css(),
    };

    useEffect(() => {
        fetch(`/api/problems/${file}`)
            .then((res) => res.text())
            .then(setCode);
    }, [file]);

    const saveCode = async () => {
        setIsSaving(true);
        const response = await fetch(`/api/problems/${file}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: code }),
        });

        if (response.ok) {
            alert("코드가 저장되었습니다!");
        } else {
            alert("저장 실패!");
        }
        setIsSaving(false);
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <span className="file-name">{file}</span>
                <button className="save-button" onClick={saveCode} disabled={isSaving}>
                    {isSaving ? "저장 중..." : "저장"}
                </button>
            </div>
            <div className="editor-wrapper">
                <CodeMirror
                    value={code}
                    className="code-editor"
                    theme={dracula}
                    extensions={[languageExtensions[fileExtension] || python()]}
                    onChange={(value) => setCode(value)}
                />
            </div>

            {/* 하단 툴바 */}
            <div className="bottom-toolbar">
                <button className="toolbar-button">주석 추가</button>
                <button className="toolbar-button" onClick={() => setShowAnalysis(!showAnalysis)}>
                    AI 분석
                </button>
            </div>

            {/* AI 분석 결과 박스 (showAnalysis가 true일 때만 표시) */}
            {showAnalysis && (
                <div className="ai-analysis-box">
                    <h3>🧠 AI 분석 결과</h3>
                    <p><strong>코드 구조 분석</strong></p>
                    <p>이 코드는 기본적인 알고리즘 구현을 보여주는 예제입니다.</p>
                    
                    <p><strong>개선 제안</strong></p>
                    <p>변수명을 더 명확하게 지정하고, 주석을 추가하면 좋을 것 같습니다.</p>

                    <p><strong>주요 포인트</strong></p>
                    <ul>
                        <li>알고리즘의 시간 복잡도는 <strong>O(n²)</strong>입니다.</li>
                        <li>중첩 반복문을 사용하여 구현되었습니다.</li>
                        <li>코드의 가독성이 좋은 편입니다.</li>
                    </ul>
                </div>
            )}
        </div>
    );
}