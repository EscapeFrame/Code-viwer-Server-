"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProblemList() {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        fetch("/api/problems")
            .then(res => res.json())
            .then(setProblems);
    }, []);

    return (
        <div className="problems-container">
            <header className="problems-header">
                <h1>문제 목록</h1>
            </header>
            <main className="problems-list">
                {problems.map(problem => (
                    <div key={problem.id} className="problem-card">
                        <Link href={`/problems/${problem.fileName}`} legacyBehavior>
                            <a className="problem-title">{problem.title}</a>
                        </Link>
                        <div className="problem-info">
                            <span className="problem-difficulty">{problem.difficulty}</span>
                            <span className="problem-language">{problem.language}</span>
                            <span className="problem-number">#{problem.id}</span>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}