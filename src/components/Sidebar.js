"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetch("/api/problems")
            .then(res => res.json())
            .then(setFiles);
    }, []);

    return (
        <aside className="sidebar">
            <div className="sidebar-header">EXPLORER</div>
            <ul className="file-list">
                {files.map(file => (
                    <li key={file.fileName}>
                        <Link href={`/problems/${file.fileName}`}>{file.title}</Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}