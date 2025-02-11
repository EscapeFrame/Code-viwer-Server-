"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function CommentForm() {
    const { file } = useParams();
    const [comment, setComment] = useState("");

    const handleSubmit = async () => {
        await fetch(`/api/comments/${file}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: comment })
        });
        setComment("");
    };

    return (
        <div id="commentForm">
            <textarea
                className="comment-input"
                placeholder="주석을 입력하세요..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button className="toolbar-button" onClick={handleSubmit}>저장</button>
        </div>
    );
}