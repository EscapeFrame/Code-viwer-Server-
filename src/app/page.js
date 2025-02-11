import Link from 'next/link';
import Image from 'next/image'
export default function HomePage() {
    return (
        <main className="main-container">
            <header className="main-header">
                <h1>
            {/* <Image 
                src="/img/CodeViewer.png"  
                alt="Code Viewer"
                width={0}  
                height={0} 
                // sizes="100vw"
                style={{ width: "auto", height: "auto" }}  
            /> */}
            Code Viewer</h1>
                <p className="subtitle">코딩 독해력 향상 플랫폼</p>
            </header>

            <section className="features">
                <div className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h2>문제 풀기</h2>
                    <p>다양한 난이도의 코드 분석 문제에 도전하세요.</p>
                    <Link href="/problems" className="feature-button">문제 보러가기</Link>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">🤖</div>
                    <h2>AI 도우미</h2>
                    <p>AI의 도움을 받아 코드를 더 깊이 이해하세요.</p>
                    <Link href="/problems" className="feature-button">분석 받기</Link>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h2>학습 현황</h2>
                    <p>나의 학습 진행 상황을 확인하세요.</p>
                    <Link href="/analyze" className="feature-button">확인하기</Link>
                </div>
            </section>
        </main>
    );
}