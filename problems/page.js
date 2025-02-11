"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { dracula } from "thememirror";

export default function ProblemDetailPage() {
    const { file } = useParams();
    const [code, setCode] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisHeight, setAnalysisHeight] = useState(200);

    const isResizing = useRef(false);
    const startY = useRef(0);
    const startHeight = useRef(analysisHeight);

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


    const handleMouseDown = (e) => {
        e.preventDefault();
        isResizing.current = true;
        startY.current = e.clientY;
        startHeight.current = analysisHeight;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const deltaY = e.clientY - startY.current; 
        const newHeight = Math.max(100, Math.min(600, startHeight.current - deltaY));
        setAnalysisHeight(newHeight);
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <span className="file-name">{file}</span>
                <button className="save-button" onClick={saveCode} disabled={isSaving}>
                    {isSaving ? "저장 중..." : "저장"}
                </button>
            </div>


            <div className="editor-wrapper" style={{ height: `calc(100vh - ${showAnalysis ? analysisHeight + 80 : 80}px)` }}>
                <CodeMirror
                    value={code}
                    height="100%"
                    width="100%"
                    theme={dracula}
                    className="code-editor"
                    extensions={[languageExtensions[fileExtension] || python()]}
                    onChange={(value) => setCode(value)}
                />
            </div>


            {showAnalysis && (
                <div className="ai-analysis-box" style={{ height: `${analysisHeight}px` }}>
                    <div className="resize-handle" onMouseDown={handleMouseDown}></div>
                    <h3>AI 분석 결과</h3>
                    <p><strong>코드 구조 분석</strong></p>
                    <ul>
                        <li>이 코드는 기본적인 알고리즘 구현을 보여주는 예제입니다.</li>
                    </ul>
                    <p><strong>개선 제안</strong></p>
                    <ul>
                        <li>변수명을 더 명확하게 지정하고, 주석을 추가하면 좋을 것 같습니다.</li>
                    </ul>
                    <p><strong>주요 포인트</strong></p>
                    <ul>
                        <li>알고리즘의 시간 복잡도는 <strong>O(n²)</strong>입니다.</li>
                        <li>중첩 반복문을 사용하여 구현되었습니다.</li>
                        <li>코드의 가독성이 좋은 편입니다.</li>
                        <li>코드의 가독성이 좋은 편입니다.</li>
                        <li>코드의 가독성이 좋은 편입니다.</li>
                        <li>코드의 가독성이 좋은 편입니다.</li>
                        <li>코드의 가독성이 좋은 편입니다.</li>
                        <li>코드의 가독성이 좋은 편입니다.</li>
                    </ul>
                </div>
            )}


            <div className="bottom-toolbar">
                <button className="toolbar-button">주석 추가</button>
                <button className="toolbar-button" onClick={() => setShowAnalysis(!showAnalysis)}>
                    AI 분석
                </button>
            </div>
        </div>
    );
}