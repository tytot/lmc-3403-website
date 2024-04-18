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
                    <a className="btn btn-primary disabled" type="button" href="/task/02" aria-disabled="true">
                        Task 2
                    </a>
                    <a className="btn btn-primary disabled" type="button" href="/task/03" aria-disabled="true">
                        Task 3
                    </a>
                </div>
            </div>
        </main>
    )
}
