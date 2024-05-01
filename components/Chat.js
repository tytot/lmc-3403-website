import { useEffect, useRef, useState } from 'react'
import styles from './Chat.module.css'

export const CHAT_STAGES = {
    INITIAL: 0,
    DESCRIPTION_SENT: 1,
    CODE_SENDING: 2,
    CODE_SENT: 3,
}

export default function Chat({ className, messages, onResponse, primaryButtonText }) {
    const body = useRef(null)
    const [stage, setStage] = useState(CHAT_STAGES.INITIAL)

    console.log(messages.length)

    function effectiveMessages() {
        switch (stage) {
            case CHAT_STAGES.INITIAL:
                return messages.slice(0, messages.length - 2)
            case CHAT_STAGES.DESCRIPTION_SENT:
                return messages.slice(0, messages.length - 1)
            case CHAT_STAGES.CODE_SENDING:
                return [
                    ...messages.slice(0, messages.length - 1),
                    <div className="spinner-border text-light mx-1 mt-1" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>,
                ]
            case CHAT_STAGES.CODE_SENT:
                return messages
        }
    }

    useEffect(() => {
        body.current.scroll({ behavior: 'smooth', top: body.current.scrollHeight })
        if (stage === CHAT_STAGES.CODE_SENT) {
            onResponse(stage)
        }
    }, [stage])

    return (
        <div className={`card ${className}`}>
            <div className="card-header">(Mock) ChatGPT</div>
            <div className="card-body overflow-auto" ref={body}>
                {effectiveMessages().map((message, index) => {
                    const right = index % 2 === 0
                    return (
                        <div
                            key={index}
                            className={`d-flex flex-row${right ? '-reverse' : ''} mb-2 m${right ? 's' : 'e'}-5`}
                        >
                            <div
                                className={`${styles.bubble} ${
                                    right ? 'bg-light border' : 'bg-primary'
                                } p-2 overflow-hidden`}
                            >
                                {message}
                            </div>
                        </div>
                    )
                })}
                {stage === CHAT_STAGES.INITIAL && !!primaryButtonText && (
                    <button
                        type="button"
                        className="btn btn-primary float-end btn-sm"
                        onClick={() => {
                            setStage(CHAT_STAGES.DESCRIPTION_SENT)
                            setTimeout(() => {
                                setStage(CHAT_STAGES.CODE_SENDING)
                            }, 1000)
                            setTimeout(() => {
                                setStage(CHAT_STAGES.CODE_SENT)
                            }, 4000)
                        }}
                    >
                        {primaryButtonText}
                    </button>
                )}
            </div>
        </div>
    )
}
