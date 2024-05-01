'use client'

import styles from './page.module.css'

export default function Home() {
    return (
        <main className={`container d-flex justify-content-center align-items-center ${styles.content}`}>
            <div>
                <h1 className="text-center mb-4">The Programmer's Guide to Using AI</h1>
                <div className="d-grid gap-2 col-6 mx-auto">
                    <a className="btn btn-primary" type="button" href="/task/01">
                        Task 1 (Algorithm Implementation)
                    </a>
                    <a className="btn btn-primary" type="button" href="/task/02">
                        Task 2 (Debugging)
                    </a>
                </div>
            </div>
        </main>
    )
}
