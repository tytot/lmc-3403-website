import { Editor, DiffEditor } from '@monaco-editor/react'
import styles from './Task.module.css'
import Chat, { CHAT_STAGES } from '@/components/Chat'
import { useRef, useState } from 'react'
import Tests from '@/components/Tests'
import { useRouter } from 'next/navigation'

export const STEP_TYPES = {
    PROMPT: 0,
    PASTE: 1,
    TEST: 2,
    FIX: 3,
    HELP: 4,
}

export default function Task({
    options: {
        steps,
        title,
        description,
        pasteButtonText,
        initialCode,
        language,
        helpDialogContent,
        completeDialogContent,
    },
}) {
    const router = useRouter()
    const editorRef = useRef(null)
    const [tab, setTab] = useState(0)
    const [stepIndex, setStepIndex] = useState(0)
    const [messages, setMessages] = useState(
        steps[0].type === STEP_TYPES.PROMPT ? [steps[0].question, steps[0].answer] : []
    )
    const [code, setCode] = useState(initialCode)
    const [testsIndex, setTestsIndex] = useState(0)
    const [tests, setTests] = useState(null)
    const [didTest, setDidTest] = useState(false)

    function goToNextStep() {
        if (stepIndex + 1 >= steps.length) {
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('complete-dialog'))
            setTimeout(() => modal.show(), 1000)
        } else {
            const step = steps[stepIndex]
            if (step.type === STEP_TYPES.PASTE) {
                editorRef.current.setValue(step.value)
                setCode(step.value)
            } else if (step.type === STEP_TYPES.FIX) {
                setCode(step.value)
            } else if (step.type === STEP_TYPES.HELP) {
                bootstrap.Modal.getInstance(document.getElementById('help-dialog')).hide()
            }
            const nextStep = steps[stepIndex + 1]
            if (nextStep.type === STEP_TYPES.PROMPT) {
                setMessages([...messages, nextStep.question, nextStep.answer])
            } else if (nextStep.type === STEP_TYPES.HELP) {
                const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('help-dialog'))
                modal.show()
            } else if (nextStep.type === STEP_TYPES.TEST) {
                setDidTest(false)
            }
            setStepIndex(stepIndex + 1)
        }
    }

    function handleEditorDidMount(editor, _, callback) {
        editorRef.current = editor
        if (callback) {
            callback()
        }
    }

    const step = steps[stepIndex]

    const content = (
        <div className={`${styles.content} row gx-3 p-3`}>
            <div className="col h-100 overflow-hidden">
                <div className="card h-100">
                    <div className="card-header p-0">
                        <ul className="nav nav-pills">
                            {[
                                ['Description', true],
                                ['Tests', !!tests],
                            ].map(([name, enabled], index) => (
                                <li className="nav-item" key={index}>
                                    <a
                                        className={`nav-link rounded-0${tab === index ? ' active' : ''}${
                                            enabled ? '' : ' disabled'
                                        }`}
                                        aria-disabled={!enabled}
                                        onClick={() => setTab(index)}
                                    >
                                        {name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card-body overflow-auto p-0">
                        <div className="p-3" hidden={tab !== 0}>
                            <h5 className="card-title">{title}</h5>
                            <div>{description}</div>
                        </div>
                        {tests !== null && (
                            <div hidden={tab !== 1}>
                                <Tests
                                    key={testsIndex}
                                    tests={tests}
                                    onComplete={tests.every(([success]) => success) || !step.next ? goToNextStep : null}
                                    primaryButtonText={stepIndex === testsIndex ? step.next : null}
                                    onPrimaryButtonClick={goToNextStep}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col h-100 overflow-hidden d-flex flex-column">
                <Chat
                    key={messages}
                    className="h-50"
                    messages={messages}
                    onResponse={(chatStage) => {
                        if (chatStage === CHAT_STAGES.CODE_SENT) {
                            goToNextStep()
                        }
                    }}
                    primaryButtonText={step.text}
                />
                <div className="align-self-center my-2">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={step.type !== STEP_TYPES.PASTE}
                        onClick={goToNextStep}
                    >
                        <span className="me-2">{pasteButtonText}</span>
                        <i className="bi bi-arrow-down"></i>
                    </button>
                </div>
                <div className="card flex-grow-1">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        Code
                        {step.type === STEP_TYPES.FIX ? (
                            <button type="button" className="btn btn-success btn-sm" onClick={goToNextStep}>
                                <i className="bi bi-check-lg me-1"></i>Approve Changes
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                disabled={step.type !== STEP_TYPES.TEST || didTest}
                                onClick={() => {
                                    setTab(1)
                                    setTestsIndex(stepIndex)
                                    setTests(step.tests)
                                    setDidTest(true)
                                }}
                            >
                                <i className="bi bi-play me-1"></i>Test
                            </button>
                        )}
                    </div>
                    {step.type === STEP_TYPES.FIX ? (
                        <DiffEditor
                            className="pb-2"
                            defaultLanguage={language}
                            original={code}
                            modified={step.value}
                            onMount={handleEditorDidMount}
                            options={{ renderSideBySide: false, readOnly: true, fontSize: 12 }}
                        />
                    ) : (
                        <Editor
                            className="pb-2"
                            defaultLanguage={language}
                            defaultValue={code}
                            onMount={handleEditorDidMount}
                            options={{ readOnly: step.type !== STEP_TYPES.PROMPT, fontSize: 12 }}
                        />
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <>
            {content}
            <div
                id="help-dialog"
                className="modal fade"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="help-dialog-title"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="help-dialog-title">
                                Before we fix the issue...
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">{helpDialogContent}</div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={goToNextStep}
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="complete-dialog"
                className="modal fade"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="complete-dialog-title"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="complete-dialog-title">
                                Task Complete
                            </h5>
                        </div>
                        <div className="modal-body">{completeDialogContent}</div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    bootstrap.Modal.getInstance(document.getElementById('complete-dialog')).hide()
                                    router.push('/')
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
