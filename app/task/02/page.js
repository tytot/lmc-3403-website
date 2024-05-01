'use client'

import Task, { STEP_TYPES } from '@/components/Task'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Task2() {
    useEffect(() => {
        alert(
            'Welcome to the second task! In this task, you will fix a tricky bug in your code with the help of ChatGPT. Click the buttons to proceed.'
        )
    }, [])

    const description = (
        <>
            <p>
                You have been tasked to implement a method that adds an item to the customer's shopping cart. Each item
                will have the type <code>&#123; name: string, price: number &#125;</code>. The method should return the
                updated shopping cart.
            </p>
            <p>
                Assume that <code>cart</code> (an array of items that represents the shopping cart) may or may not be
                defined in the global scope. If it is not, the returned value will be used to initialize{' '}
                <code>cart</code> globally.
            </p>
            <p>
                You have written code that seems correct to you, but it is failing some tests. Use ChatGPT to help you
                debug the issue.
            </p>
        </>
    )

    const initialCode = `function addToCart(item) {
    if (!cart) {
        var cart = [];
    }
    cart.push(item);
    return cart;
}

// Adding an item to the cart
const item = { name: 'Book', price: 12.99 };
const currentCart = addToCart(item);
console.log('Cart:', currentCart);`

    const chatGPTCode = `function addToCart(item) {
    if (!cart) {
        var cart = [];
    }
    // Check if the item already exists in the cart
    const itemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    if (itemIndex === -1) {
        cart.push(item);
    } else {
        // Optionally, update the quantity or handle duplicates differently
        console.log('Item already exists in the cart.');
    }
    return cart;
}

// Adding an item to the cart
const item = { name: 'Book', price: 12.99 };
const currentCart = addToCart(item);
console.log('Cart:', currentCart);`

    const correctCode = `function addToCart(item) {
    if (typeof cart === 'undefined') {
        cart = []; // Initialize once if not already defined
    }
    cart.push(item);
    return cart;
}`

    const prompt = (
        <>
            <p>Why is this function failing tests?</p>
            <pre>{initialCode}</pre>
        </>
    )

    const response = (
        <>
            <p>
                Each time you call <code>addToCart</code>, it should check if the cart already contains the item. If it
                does, it should ideally have a mechanism to prevent adding the same item multiple times, which it
                currently lacks. This can lead to problems when you're trying to manage inventory or apply promotions
                based on unique items in the cart. Consider implementing a check to see if the item already exists in
                the cart before adding it.
            </p>
            <p>
                Here is the revised code to handle duplicate items by checking if the item already exists in the cart
                before adding it:
            </p>
            <pre>{chatGPTCode}</pre>
        </>
    )

    const newPrompt = (
        <>
            <p>
                Below is my implementation of a method <code>addToCart</code> that adds an item to the customer's
                shopping cart. Each item will have the type <code>&#123; name: string, price: number &#125;</code>. The
                method should return the updated shopping cart. Also, I was told to assume that <code>cart</code> may or
                may not be defined in the global scope. If it is not, the returned value will be used to initialize{' '}
                <code>cart</code> globally.
            </p>
            <pre>{initialCode}</pre>
            <p>It is failing the following test:</p>
            <p>
                <strong>Input</strong>
            </p>
            <pre>{`const cart = addToCart({name: 'Shirt', price: 19.99});
console.log(cart.length);`}</pre>
            <p>
                <strong>Output</strong>
            </p>
            <pre>{'1'}</pre>
            <p>
                <strong>Expected</strong>
            </p>
            <pre>{'2'}</pre>
            <p>Please provide an explanation as to why this test might be failing given my implementation.</p>
        </>
    )

    const newResponse = (
        <>
            <p>
                The test is failing due to how the <code>cart</code> variable is handled in the <code>addToCart</code>{' '}
                function.
            </p>
            <p>
                The <code>var cart</code> inside the <code>addToCart</code> function is declared locally due to the{' '}
                <code>var</code> keyword. Each time <code>addToCart</code> is called, it creates a new local{' '}
                <code>cart</code> array if <code>cart</code> is not already defined in that scope. This means that any
                existing global <code>cart</code> is ignored during the function execution because the local declaration
                shadows any outer (global) declaration.
            </p>
            <p>
                To ensure that <code>cart</code> accumulates items correctly across multiple function calls, you should
                check for the existence of <code>cart</code> in a global scope and avoid redefining it locally. Here is
                a corrected version of the function:
            </p>
            <pre>{correctCode}</pre>
        </>
    )

    const tests = [
        [true],
        [true],
        [
            false,
            <>
                <p>
                    <strong>Input</strong>
                </p>
                <pre>{`const cart = addToCart({name: 'Shirt', price: 19.99});
console.log(cart.length);`}</pre>
                <p>
                    <strong>Output</strong>
                </p>
                <pre>{'1'}</pre>
                <p>
                    <strong>Expected</strong>
                </p>
                <pre>{'2'}</pre>
            </>,
        ],
        [true],
        [true],
        [true],
        [true],
        [true],
    ]

    const helpDialogContent = (
        <>
            <p>
                "Programming is 10% writing code and 90% figuring out why it doesn't work." This statement captures the
                essence of the challenges and time commitment involved in debugging and troubleshooting in software
                engineering.
            </p>
            <p>
                Given how time-consuming debugging is, it makes sense to use ChatGPT or other AI tools to help you
                figure out what's wrong with your code. But in this case, the tests are still failing even after taking
                ChatGPT's advice! How could that be?
            </p>
            <p>
                Well, while ChatGPT is proficient at generating code, it can struggle with improving it.{' '}
                <a href="https://arxiv.org/pdf/2307.08260" target="_blank">
                    This study
                </a>{' '}
                out of George Mason University found that ChatGPT was only able to improve code solutions in{' '}
                <strong>36.7%</strong> of cases. This result means that ChatGPT might not be the best at learning from
                feedback and errors to debug code.
            </p>
            <Image
                src="/images/02.png"
                width={446}
                height={347}
                alt="A pie chart displaying a 63.3% not improved rate and a 36.7 improved rate"
            />
            <p>
                In professional software engineering, bugs can stem from sources multiple layers deep, requiring a deep
                understanding of the systems and connections you're working with. It is very difficult to provide AI
                tools with the context they need to tackle complex bugs. Therefore, it's crucial to have a strong
                ability to think critically debug effectively, which is a skill that comes with time and experience.
                Nonetheless, ChatGPT can still be a valuable tool in your debugging toolkit if you give it enough
                background knowledge.
            </p>
            <p>
                In our previous prompt, we likely did not provide enough context for ChatGPT to understand the issue
                fully. Let's try again with more detail this time, including the task specifications and the results of
                the failed test.
            </p>
        </>
    )

    const completeDialogContent = (
        <>
            <p>Good job, you fixed the bug!</p>
            <p>
                Once we gave more context to ChatGPT, it was able to narrow down the reason for the failed test. ChatGPT
                will not be able to solve all of your bugs, but with detailed enough prompts, it can help you understand
                the cause of your problems.
            </p>
            <p>
                <strong>Lesson learned:</strong> when debugging with AI tools, provide them with enough context to fully
                understand your issues.
            </p>
        </>
    )

    return (
        <Task
            options={{
                steps: [
                    {
                        type: STEP_TYPES.TEST,
                        tests: tests,
                    },
                    { type: STEP_TYPES.PROMPT, question: prompt, answer: response, text: 'Ask for Help' },
                    { type: STEP_TYPES.PASTE, value: chatGPTCode },
                    { type: STEP_TYPES.TEST, tests: tests, next: 'Help' },
                    { type: STEP_TYPES.HELP },
                    {
                        type: STEP_TYPES.PROMPT,
                        question: newPrompt,
                        answer: newResponse,
                        text: 'Ask for Help With More Detail',
                    },
                    { type: STEP_TYPES.PASTE, value: correctCode },
                    { type: STEP_TYPES.TEST, tests: Array(8).fill([true]) },
                ],
                title: 'Debugging',
                description: description,
                pasteButtonText: 'Apply Suggestions',
                initialCode: initialCode,
                language: 'javascript',
                helpDialogContent: helpDialogContent,
                completeDialogContent: completeDialogContent,
            }}
        />
    )
}
