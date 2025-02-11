"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CodeViewer() {
    const { file } = useParams();
    const [code, setCode] = useState("");

    useEffect(() => {
        fetch(`/api/problems/${file}`)
            .then(res => res.text())
            .then(setCode);
    }, [file]);

    return (
        <div className="code-container">
            <h1>{file}</h1>
            <pre><code className="code-content">{code}</code></pre>
        </div>
    );
}