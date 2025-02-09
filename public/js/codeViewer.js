// 전역 네임스페이스 객체 생성
window.CodeViewerApp = window.CodeViewerApp || {};

// API 엔드포인트를 네임스페이스 안에 정의
CodeViewerApp.API_ENDPOINTS = {
    comments: (file) => `/api/comments/${file}`,
    analyze: (file) => `/api/analyze/${file}`,
    problem: (file) => `/api/problem/${file}`
};

document.addEventListener('DOMContentLoaded', () => {
    // 싱글톤 패턴 적용
    if (!window.codeViewer) {
        window.codeViewer = new CodeViewer();
    }
});

class CodeViewer {
    constructor() {
        // 이미 인스턴스가 있다면 생성하지 않음
        if (window.codeViewer) {
            return window.codeViewer;
        }

        this.currentFile = null;
        this.comments = {};
        this.selectedRange = null;
        this.editor = null;
        this.initialized = false;
        this.init();
    }

    init() {
        // 중복 초기화 방지
        if (this.initialized) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('file');

        if (fileName) {
            this.currentFile = fileName;
            this.loadFileContent(fileName);
        }

        this.initializeEventListeners();
        this.initialized = true;
    }

    initializeEventListeners() {
        const addCommentBtn = document.getElementById('addComment');
        const aiAnalysisBtn = document.getElementById('aiAnalysis');

        if (addCommentBtn) {
            addCommentBtn.addEventListener('click', () => this.handleAddComment());
        }
        if (aiAnalysisBtn) {
            aiAnalysisBtn.addEventListener('click', () => this.handleAiAnalysis());
        }
    }

    async loadFileContent(fileName) {
        try {
            const fileNameElement = document.getElementById('fileName');
            if (fileNameElement) {
                fileNameElement.textContent = fileName;
            }

            // 기존 에디터가 있다면 제거
            if (this.editor) {
                this.editor.toTextArea();
                this.editor = null;
            }

            // 기존 CodeMirror 요소 제거
            const existingEditors = document.querySelectorAll('.CodeMirror');
            existingEditors.forEach(editor => editor.remove());

            const response = await fetch(`/api/problem/${fileName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const code = await response.text();
            const codeContent = document.getElementById('codeContent');
            
            if (codeContent) {
                codeContent.value = code; // textarea 값 설정

                // 언어 모드 결정
                const fileExt = fileName.split('.').pop().toLowerCase();
                const modeMap = {
                    'py': 'python',
                    'js': 'javascript',
                    'java': 'text/x-java',
                    'cpp': 'text/x-c++src',
                    'c': 'text/x-csrc',
                    'html': 'xml',
                    'css': 'css'
                };

                const mode = modeMap[fileExt] || 'text/plain';

                // CodeMirror 설정
                this.editor = CodeMirror.fromTextArea(codeContent, {
                    value: code,
                    mode: mode,
                    theme: 'monokai',
                    lineNumbers: true,
                    readOnly: true,
                    viewportMargin: Infinity,
                    lineWrapping: true,
                    fixedGutter: true,
                    gutters: ['CodeMirror-linenumbers'],
                });

                // 에디터 크기 설정
                this.editor.setSize('100%', 'auto');
            }
        } catch (error) {
            console.error('파일 내용 로드 실패:', error);
            const fileNameElement = document.getElementById('fileName');
            if (fileNameElement) {
                fileNameElement.textContent = 'Error';
            }
        }
    }

    async loadFileList() {
        try {
            const response = await fetch('/api/file-list');
            if (!response.ok) throw new Error('파일 목록을 가져오는데 실패했습니다.');

            const files = await response.json();

            // 파일 목록 표시
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = files.map(file => `
                <li data-file="${file.name}" class="file-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 4H3V12H13V4Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M3 4L8 8L13 4" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    ${file.name}
                </li>
            `).join('');

            // 파일 클릭 이벤트 추가
            document.querySelectorAll('.file-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const fileName = item.dataset.file;

                    // 이전 활성 파일의 스타일 제거
                    if (this.currentFile) {
                        document.querySelector(`.file-item[data-file="${this.currentFile}"]`).classList.remove('active');
                    }

                    // 현재 파일 활성화
                    item.classList.add('active');
                    this.currentFile = fileName;

                    try {
                        await this.loadFileContent(fileName);
                    } catch (error) {
                        console.error('Error:', error);
                        const codeContent = document.getElementById('codeContent');
                        codeContent.textContent = `// Error: ${error.message}`;
                    }
                });
            });

            // 첫 번째 파일 자동 선택 (있는 경우)
            const firstFile = document.querySelector('.file-item');
            if (firstFile) {
                firstFile.click();
            }
        } catch (error) {
            console.error('Error:', error);
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = `<li class="error">Error: ${error.message}</li>`;
        }
    }

    getFileIcon(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        const icons = {
            'py': '🐍',
            'js': '📜',
            'java': '☕',
            'cpp': '⚡',
            'c': '🔧',
            'default': '📄'
        };
        return icons[ext] || icons.default;
    }

    async handleAddComment() {
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none';
        }
    }

    async handleAiAnalysis() {
        try {
            const response = await fetch(`/api/analyze/${this.currentFile}`);
            const analysis = await response.json();

            const aiAnalysisResult = document.getElementById('aiAnalysisResult');
            if (aiAnalysisResult) {
                aiAnalysisResult.innerHTML = `
                    <h3>AI 분석 결과</h3>
                    <div class="analysis-content">
                        <h4>코드 구조 분석</h4>
                        <p>${analysis.structure}</p>
                        <h4>개선 제안</h4>
                        <p>${analysis.suggestions}</p>
                        <h4>주요 포인트</h4>
                        <ul>
                            ${analysis.keyPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                `;
                aiAnalysisResult.style.display = 'block';
            }
        } catch (error) {
            console.error('AI 분석 실패:', error);
            alert('AI 분석에 실패했습니다.');
        }
    }

    async loadComments() {
        if (!this.currentFile) return;

        try {
            const response = await fetch(CodeViewerApp.API_ENDPOINTS.comments(this.currentFile));
            if (response.ok) {
                this.comments[this.currentFile] = await response.json();
                this.renderComments();
            }
        } catch (error) {
            console.error('주석 로드 실패:', error);
        }
    }

    renderComments() {
        if (!this.currentFile || !this.comments[this.currentFile]) return;

        const codeContent = document.getElementById('codeContent');
        const code = codeContent.textContent;

        // 주석 목록 표시
        const commentsList = document.createElement('div');
        commentsList.className = 'comments-list';

        this.comments[this.currentFile].forEach((comment, index) => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-code">${comment.text}</div>
                <div class="comment-text">${comment.comment}</div>
                <div class="comment-time">${new Date(comment.timestamp).toLocaleString()}</div>
            `;
            commentsList.appendChild(commentElement);
        });

        // 기존 주석 목록 제거 후 새로 추가
        const existingCommentsList = document.querySelector('.comments-list');
        if (existingCommentsList) {
            existingCommentsList.remove();
        }
        codeContent.parentElement.appendChild(commentsList);
    }
}

// 인스턴스를 네임스페이스에 추가
CodeViewerApp.viewer = new CodeViewer(); 