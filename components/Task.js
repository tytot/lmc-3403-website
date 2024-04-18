import { Editor, DiffEditor } from '@monaco-editor/react'
import styles from './Task.module.css'
import Chat, { CHAT_STAGES } from '@/components/Chat'
import { useRef, useState } from 'react'
import Tests from '@/components/Tests'
import { useRouter } from 'next/navigation'

const STAGES = {
    CHATTING: 0,
    PASTING: 1,
    PASTED: 2,
    TESTING: 3,
    FIXING: 4,
    FIXED: 5,
    TESTING_AGAIN: 6,
}

export default function Task({
    options: {
        description,
        initialCode,
        chatGPTCode,
        correctCode,
        response,
        tests,
        helpDialogContent,
        completeDialogContent,
    },
}) {
    const router = useRouter()
    const editorRef = useRef(null)
    const [completeModal, setCompleteModal] = useState()
    const [tab, setTab] = useState(0)
    const [stage, setStage] = useState(STAGES.CHATTING)

    function handleEditorDidMount(editor, _, callback) {
        editorRef.current = editor
        if (callback) {
            callback()
        }
    }

    const content = (
        <div className={`${styles.content} row gx-3 p-3`}>
            <div className="col h-100 overflow-hidden">
                <div className="card h-100">
                    <div className="card-header p-0">
                        <ul className="nav nav-pills">
                            {[
                                ['Description', true],
                                ['Tests', stage >= STAGES.TESTING],
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
                            <h5 className="card-title">Algorithm Implementation</h5>
                            <div>{description}</div>
                        </div>{' '}
                        {stage >= STAGES.TESTING && (
                            <div hidden={tab !== 1}>
                                {stage < STAGES.TESTING_AGAIN ? (
                                    <Tests key={0} tests={tests} />
                                ) : (
                                    <Tests
                                        key={1}
                                        tests={[[true], [true], [true], [true], [true]]}
                                        onComplete={() => {
                                            const modal = new bootstrap.Modal(
                                                document.getElementById('complete-dialog')
                                            )
                                            setCompleteModal(modal)
                                            setTimeout(() => modal.show(), 1000)
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col h-100 overflow-hidden d-flex flex-column">
                <Chat
                    className="h-50"
                    messages={[description, response]}
                    onResponse={(chatStage) => {
                        if (chatStage === CHAT_STAGES.CODE_SENT) {
                            setStage(STAGES.PASTING)
                        }
                    }}
                />
                <div className="align-self-center my-2">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={stage !== STAGES.PASTING}
                        onClick={() => {
                            editorRef.current.setValue(chatGPTCode)
                            setStage(STAGES.PASTED)
                        }}
                    >
                        <span className="me-2">Paste Code</span>
                        <i className="bi bi-arrow-down"></i>
                    </button>
                </div>
                <div className="card flex-grow-1">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        Code
                        {stage === STAGES.FIXING ? (
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                    setStage(STAGES.FIXED)
                                }}
                            >
                                <i className="bi bi-check-lg me-1"></i>Approve Changes
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                disabled={stage !== STAGES.PASTED && stage !== STAGES.FIXED}
                                onClick={() => {
                                    setStage(stage === STAGES.PASTED ? STAGES.TESTING : STAGES.TESTING_AGAIN)
                                    setTab(1)
                                }}
                            >
                                <i className="bi bi-play me-1"></i>Test
                            </button>
                        )}
                    </div>
                    {stage === STAGES.FIXING ? (
                        <DiffEditor
                            className="pb-2"
                            defaultLanguage="python"
                            original={chatGPTCode}
                            modified={correctCode}
                            onMount={(editor, monaco) =>
                                handleEditorDidMount(editor, monaco, () => editorRef.current.revealLine(40))
                            }
                            options={{ renderSideBySide: false, readOnly: true, fontSize: 12 }}
                        />
                    ) : (
                        <Editor
                            className="pb-2"
                            defaultLanguage="python"
                            defaultValue={stage === STAGES.FIXED ? correctCode : initialCode}
                            onMount={
                                stage === STAGES.FIXED
                                    ? (editor, monaco) =>
                                          handleEditorDidMount(editor, monaco, () => editorRef.current.revealLine(40))
                                    : handleEditorDidMount
                            }
                            options={{ readOnly: stage >= STAGES.PASTED, fontSize: 12 }}
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
                                onClick={() => {
                                    setStage(STAGES.FIXING)
                                }}
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
                                    completeModal.hide()
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
