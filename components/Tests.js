import { useEffect, useState } from 'react'
import styles from './Tests.module.css'

export default function Tests({ tests, onComplete }) {
    const [testsInProgress, setTestsInProgress] = useState(tests.map(() => true))

    useEffect(() => {
        tests.forEach((_, index) =>
            setTimeout(() => setTestsInProgress(tests.map((_, i) => i > index)), (index + 1) * 1000)
        )
        setTimeout(onComplete, tests.length * 1000)
    }, [])

    const inProgress = testsInProgress.some((inProgress) => inProgress)
    const numIncorrect = tests.filter(([success]) => !success).length

    return (
        <>
            <h6 className={`pt-3 pb-2 px-3${inProgress ? '' : numIncorrect ? ' text-danger' : ' text-success'}`}>
                {inProgress
                    ? 'Testing against real-world scenarios...'
                    : numIncorrect
                    ? `${numIncorrect} test(s) failed`
                    : 'All tests passed'}
            </h6>
            <div className={`accordion accordion-flush ${styles.container}`} id="tests">
                {tests.map(([success, content], index) => {
                    const inProgress = testsInProgress[index]
                    const headingId = `flush-heading${index}`
                    const collapseId = `flush-collapse${index}`
                    return (
                        <div className="accordion-item">
                            <h2 className="accordion-header" id={headingId}>
                                <button
                                    className={`accordion-button collapsed ${
                                        inProgress ? 'text-muted' : success ? 'text-success' : 'text-danger'
                                    }`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#${collapseId}`}
                                    aria-expanded="false"
                                    aria-controls={collapseId}
                                    disabled={success}
                                >
                                    {inProgress ? (
                                        <div className="spinner-border text-muted me-2" role="status"></div>
                                    ) : (
                                        <i className={`bi bi-${success ? 'check' : 'x'}-lg me-2`}></i>
                                    )}{' '}
                                    Test {index + 1}
                                </button>
                            </h2>
                            <div
                                id={collapseId}
                                className="accordion-collapse collapse"
                                aria-labelledby={headingId}
                                data-bs-parent="#tests"
                            >
                                <div className="accordion-body">{content}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
