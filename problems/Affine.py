"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CodeMirror, { oneDarkTheme } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { dracula,boysAndGirls,coolGlow } from 'thememirror';
export default function ProblemDetailPage() {
    const { file } = useParams();
    const [code, setCode] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

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

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
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
                    height="600px"
                    width="100%"
                    theme={dracula}
                    className="code-editor"
                    extensions={[languageExtensions[fileExtension] || python()]}
                    onChange={(value) => setCode(value)}

                />
            </div>

            <div className="bottom-toolbar">
                <button className="toolbar-button">주석 추가</button>
                <button className="toolbar-button">AI 분석</button>
                {/* <button className="toggle-button" onClick={toggleTheme}>
                    {isDarkMode ? "☀️" : "🌙"}
                </button> */}
            </div>
        </div>
    );
}