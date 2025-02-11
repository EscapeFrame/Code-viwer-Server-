"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProblemsPage() {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]); // 필터링된 문제들
    const [difficulty, setDifficulty] = useState("all");
    const [language, setLanguage] = useState("all");

    useEffect(() => {
        fetch("/api/problems")
            .then(res => res.json())
            .then(data => {
                setProblems(data);
                setFilteredProblems(data); // 초기값 설정
            });
    }, []);

    // 🔹 언어 선택 시 파일 확장자로 필터링
    const getFileExtension = (fileName) => {
        return fileName.split(".").pop();
    };

    const languageMap = {
        python: "py",
        javascript: "js",
        java: "java",
        cpp: "cpp",
        html: "html",
        css: "css",
        c:"c"
    };

    useEffect(() => {
        let filtered = problems;

        if (difficulty !== "all") {
            filtered = filtered.filter(problem => problem.difficulty === difficulty);
        }
        if (language !== "all") {
            const selectedExtension = languageMap[language];
            filtered = filtered.filter(problem => getFileExtension(problem.fileName) === selectedExtension);
        }

        setFilteredProblems(filtered);
    }, [difficulty, language, problems]);

    return (
        <div className="problems-container">
            <header className="problems-header">
                <h1>문제 목록</h1>
                <div className="filter-bar">
                    <select id="difficultyFilter" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="all">모든 난이도</option>
                        <option value="easy">쉬움</option>
                        <option value="medium">보통</option>
                        <option value="hard">어려움</option>
                    </select>
                    <select id="languageFilter" value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="all">모든 언어</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        <option value="css">CSS</option>
                        <option value="html">HTML</option>
                        
                    </select>
                </div>
            </header>
            <main className="problems-list">
                {filteredProblems.length > 0 ? (
                    filteredProblems.map(problem => (
                        <Link key={problem.id} href={`/problems/${problem.fileName}`} className="problem-card">
                            <div className="problem-number">#{problem.id}</div>
                            <div className="problem-title">{problem.title}</div>
                            <div className="problem-info">
                                <span className="problem-language">{getFileExtension(problem.fileName)}</span>
                                <span className={`problem-difficulty ${problem.difficulty}`}>{problem.difficulty}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="no-results">해당 조건의 문제가 없습니다.</p>
                )}
            </main>
        </div>
    );
}