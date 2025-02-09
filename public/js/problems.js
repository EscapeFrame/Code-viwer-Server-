document.addEventListener('DOMContentLoaded', () => {
    loadProblems();

    // 필터 이벤트 리스너
    const difficultyFilter = document.getElementById('difficultyFilter');
    const languageFilter = document.getElementById('languageFilter');

    if (difficultyFilter) difficultyFilter.addEventListener('change', filterProblems);
    if (languageFilter) languageFilter.addEventListener('change', filterProblems);
});

async function loadProblems() {
    try {
        const response = await fetch('/api/problems');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const problems = await response.json();
        renderProblems(problems);
    } catch (error) {
        console.error('문제 목록을 불러오는데 실패했습니다:', error);
        const problemsList = document.getElementById('problemsList');
        if (problemsList) {
            problemsList.innerHTML = `
                <div class="error-message">
                    <p>문제 목록을 불러오는데 실패했습니다.</p>
                    <p>잠시 후 다시 시도해주세요.</p>
                </div>
            `;
        }
    }
}

function renderProblems(problems) {
    const problemsList = document.getElementById('problemsList');
    if (!problemsList) return;

    problemsList.innerHTML = problems.map(problem => `
        <div class="problem-card" onclick="location.href='/problem?file=${encodeURIComponent(problem.fileName)}'">
            <div class="problem-header">
                <h2>${problem.title}</h2>
                <span class="problem-difficulty ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
            </div>
            <div class="problem-info">
                <span class="language-tag">${problem.language.name}</span>
                <span class="problem-number">#${problem.id}</span>
            </div>
        </div>
    `).join('');
}

function filterProblems() {
    const difficulty = document.getElementById('difficultyFilter').value;
    const language = document.getElementById('languageFilter').value;

    const cards = document.querySelectorAll('.problem-card');
    cards.forEach(card => {
        const cardDifficulty = card.querySelector('.problem-difficulty').textContent;
        const cardLanguage = card.querySelector('.language-tag').textContent;

        const difficultyMatch = difficulty === 'all' || cardDifficulty === difficulty;
        const languageMatch = language === 'all' || cardLanguage.toLowerCase() === language;

        card.style.display = difficultyMatch && languageMatch ? 'block' : 'none';
    });
} 