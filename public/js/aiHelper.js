class AiHelper {
    constructor() {
        this.init();
    }

    init() {
        this.initializeSearchBar();
    }

    initializeSearchBar() {
        const searchInput = document.querySelector('.ai-search input');
        const searchButton = document.querySelector('.ai-search button');

        if (!searchInput || !searchButton) {
            console.warn('AI 검색 요소를 찾을 수 없습니다.');
            return;
        }

        searchButton.addEventListener('click', () => {
            this.handleSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(searchInput.value);
            }
        });
    }

    async handleSearch(query) {
        if (!query.trim()) return;

        try {
            // 여기에 실제 AI API 호출 로직 구현
            console.log('검색어:', query);
            // 임시 알림
            alert('AI 검색 기능은 준비 중입니다.');
        } catch (error) {
            console.error('AI 검색 실패:', error);
        }
    }
}

// 인스턴스 생성
const aiHelper = new AiHelper(); 