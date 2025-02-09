const express = require('express')
const path = require('path')
const fs = require('fs').promises
const fsSync = require('fs')  // 동기 메서드를 위한 fs 모듈 추가
const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/codemirror', express.static(path.join(__dirname, 'node_modules/codemirror')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.set('views', path.join(__dirname, 'views'))

// 기본 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/problems', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'problems.html'));
});

app.get('/problem', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'problem.html'));
});

app.get('/progress', async (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'progess.html'));
});

// API 라우트
app.get('/api/problems', async (req, res) => {
    try {
        const problemsDir = path.join(__dirname, 'problems');
        const files = await fs.readdir(problemsDir);

        const problems = await Promise.all(files.map(async (file, index) => {
            const filePath = path.join(problemsDir, file);
            const stats = await fs.stat(filePath);

            // 숨김 파일 제외
            if (file.startsWith('.')) {
                return null;
            }

            return {
                id: index + 1,
                fileName: file,
                title: path.parse(file).name,
                language: getLanguageInfo(file),
                difficulty: 'medium', // 기본값
                size: stats.size
            };
        }));

        // null 값 필터링
        res.json(problems.filter(Boolean));
    } catch (error) {
        console.error('문제 목록 로드 실패:', error);
        res.status(500).json({ error: '문제 목록을 불러오는데 실패했습니다.' });
    }
});

app.get('/api/problem/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        // 파일 경로 검증
        if (fileName.includes('..') || fileName.includes('/')) {
            return res.status(400).send('잘못된 파일 이름입니다.');
        }

        const filePath = path.join(__dirname, 'problems', fileName);
        const content = await fs.readFile(filePath, 'utf-8');
        res.send(content);
    } catch (error) {
        console.error('파일 읽기 실패:', error);
        res.status(500).send('파일을 읽을 수 없습니다.');
    }
});

// 주석 저장 API
app.post('/api/comments/:file', async (req, res) => {
    const fileName = req.params.file;
    const comments = req.body;

    try {
        const commentsDir = path.join(__dirname, 'comments');
        await fs.mkdir(commentsDir, { recursive: true });

        await fs.writeFile(
            path.join(commentsDir, `${fileName}.json`),
            JSON.stringify(comments, null, 2)
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '주석 저장에 실패했습니다.' });
    }
});

// 주석 불러오기 API
app.get('/api/comments/:file', async (req, res) => {
    const fileName = req.params.file;

    try {
        const commentsPath = path.join(__dirname, 'comments', `${fileName}.json`);
        try {
            const comments = await fs.readFile(commentsPath, 'utf-8');
            res.json(JSON.parse(comments));
        } catch (error) {
            // 파일이 없는 경우 빈 배열 반환
            res.json([]);
        }
    } catch (error) {
        console.error('주석 로드 실패:', error);
        res.status(500).json({ error: '주석을 불러오는데 실패했습니다.' });
    }
});

// AI 분석 API
app.get('/api/analyze/:file', async (req, res) => {
    const fileName = req.params.file;

    try {
        const filePath = path.join(__dirname, 'problems', fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // 더미 분석 데이터 반환
        const analysis = {
            structure: "이 코드는 기본적인 알고리즘 구현을 보여주는 예제입니다.",
            suggestions: "변수명을 더 명확하게 지정하고, 주석을 추가하면 좋을 것 같습니다.",
            keyPoints: [
                "알고리즘의 시간 복잡도는 O(n²)입니다.",
                "중첩 반복문을 사용하여 구현되었습니다.",
                "코드의 가독성이 좋은 편입니다."
            ]
        };

        res.json(analysis);
    } catch (error) {
        console.error('AI 분석 실패:', error);
        res.status(500).json({ error: 'AI 분석에 실패했습니다.' });
    }
});

// 언어 정보 헬퍼 함수
function getLanguageInfo(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const languageMap = {
        '.py': { name: 'Python', mime: 'text/x-python' },
        '.js': { name: 'JavaScript', mime: 'text/javascript' },
        '.java': { name: 'Java', mime: 'text/x-java' },
        '.cpp': { name: 'C++', mime: 'text/x-c++src' },
        '.c': { name: 'C', mime: 'text/x-csrc' },
        '.html': { name: 'HTML', mime: 'text/html' },
        '.css': { name: 'CSS', mime: 'text/css' }
    };

    return languageMap[ext] || { name: 'Plain Text', mime: 'text/plain' };
}

// 서버 시작 전 디렉토리 확인
const problemsDir = path.join(__dirname, 'problems');
fs.mkdir(problemsDir, { recursive: true }).catch(console.error);

// 전역 에러 핸들러 추가
app.use((err, req, res, next) => {
    console.error('서버 오류:', err);
    res.status(500).json({
        error: '서버 오류가 발생했습니다.',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행중입니다.`);
    // fsSync.existsSync 사용
    console.log('problems 디렉토리 존재 여부:', fsSync.existsSync(problemsDir));
});