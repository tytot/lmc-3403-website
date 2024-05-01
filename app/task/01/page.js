'use client'

import Task, { STEP_TYPES } from '@/components/Task'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Task1() {
    useEffect(() => {
        alert(
            'Welcome to the first task! In this task, you will complete a realistic programming task with the help of ChatGPT. Click the buttons to proceed.'
        )
    }, [])

    const description = (
        <>
            <p>
                Design a data structure that follows the constraints of a{' '}
                <strong>
                    <a href="https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU" target="_blank">
                        Least Recently Used (LRU) cache
                    </a>
                </strong>
                .
            </p>
            <p>
                Implement the <code>LRUCache</code> class:
            </p>
            <ul>
                <li>
                    <code>LRUCache(int capacity)</code>: Initialize the LRU cache with <strong>positive</strong> size{' '}
                    <code>capacity</code>.
                </li>
                <li>
                    <code>int get(int key)</code>: Return the value of the <code>key</code> if the key exists, otherwise
                    return <code>-1</code>.
                </li>
                <li>
                    <code>void put(int key, int value)</code>: Update the value of the <code>key</code> if the{' '}
                    <code>key</code> exists. Otherwise, add the <code>key-value</code> pair to the cache. If the number
                    of keys exceeds the <code>capacity</code> from this operation, <strong>evict</strong> the least
                    recently used key.
                </li>
            </ul>
            <p>
                The functions <code>get</code> and <code>put</code> must each run in <code>O(1)</code> average time
                complexity.
            </p>
            <p>
                <strong className="example">Example 1:</strong>
            </p>
            <pre>
                <strong>Input</strong>
                {`
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
`}
                <strong>Output</strong>
                {`
[null, null, null, 1, null, -1, null, -1, 3, 4]
`}
                <strong>Explanation</strong>
                {`
LRUCache lRUCache = new LRUCache(2); 
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2} 
lRUCache.get(1); // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2); // returns -1 (not found) 
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3} 
lRUCache.get(1); // return -1 (not found)
lRUCache.get(3); // return 3 
lRUCache.get(4); // return 4`}
            </pre>
            <p>
                <strong>Constraints:</strong>
            </p>
            <ul>
                <li>
                    <code>1 &lt;= capacity &lt;= 3000</code>
                </li>
                <li>
                    <code>
                        0 &lt;= key &lt;= 10<sup>4</sup>
                    </code>
                </li>
                <li>
                    <code>
                        0 &lt;= value &lt;= 10<sup>5</sup>
                    </code>
                </li>
                <li>
                    At most{' '}
                    <code>
                        2 * 10<sup>5</sup>
                    </code>{' '}
                    calls will be made to <code>get</code> and <code>put</code>.
                </li>
            </ul>
        </>
    )

    const initialCode = `class LRUCache:

    def __init__(self, capacity: int):
        

    def get(self, key: int) -> int:
        

    def put(self, key: int, value: int) -> None:
        

# Your LRUCache object will be instantiated and called as such:
# obj = LRUCache(capacity)
# param_1 = obj.get(key)
# obj.put(key,value)`

    const chatGPTCode = `class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.hash_map = {}
        self.head = Node(0, 0)  # Dummy head
        self.tail = Node(0, 0)  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        # Remove an existing node from the linked list.
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def _add(self, node):
        # Always add to the front (right after dummy head).
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.hash_map:
            node = self.hash_map[key]
            self._remove(node)
            self._add(node)
            return node.value
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.hash_map:
            node = self.hash_map[key]
            node.value = value  # Update the value
        else:
            if len(self.hash_map) >= self.capacity:
                # Remove the LRU from the list and delete it from the hash map
                lru = self.tail.prev
                self._remove(lru)
                del self.hash_map[lru.key]
            node = Node(key, value)
            self._add(node)
            self.hash_map[key] = node

# Example Usage
# lru_cache = LRUCache(2)
# lru_cache.put(1, 1)
# lru_cache.put(2, 2)
# print(lru_cache.get(1))  # Outputs 1
# lru_cache.put(3, 3)     # Evicts key 2
# print(lru_cache.get(2))  # Outputs -1 (not found)`

    const correctCode = `class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.hash_map = {}
        self.head = Node(0, 0)  # Dummy head
        self.tail = Node(0, 0)  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        # Remove an existing node from the linked list.
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def _add(self, node):
        # Always add to the front (right after dummy head).
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.hash_map:
            node = self.hash_map[key]
            self._remove(node)
            self._add(node)
            return node.value
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.hash_map:
            node = self.hash_map[key]
            # ChatGPT did not move the node to the head of the list if the key already existed
            self._remove(node)
            self._add(node)
            node.value = value  # Update the value
        else:
            if len(self.hash_map) >= self.capacity:
                # Remove the LRU from the list and delete it from the hash map
                lru = self.tail.prev
                self._remove(lru)
                del self.hash_map[lru.key]
            node = Node(key, value)
            self._add(node)
            self.hash_map[key] = node

# Example Usage
# lru_cache = LRUCache(2)
# lru_cache.put(1, 1)
# lru_cache.put(2, 2)
# print(lru_cache.get(1))  # Outputs 1
# lru_cache.put(3, 3)     # Evicts key 2
# print(lru_cache.get(2))  # Outputs -1 (not found)`

    const response = (
        <>
            <p>Certainly! Here's a Python class implementing the LRU cache:</p>
            <pre>
                <code>{chatGPTCode}</code>
            </pre>
        </>
    )

    const tests = [
        [true],
        [true],
        [true],
        [true],
        [
            false,
            <>
                <p>
                    <strong>Input</strong>
                </p>
                <pre>{`["LRUCache","put","put","put","put","get","get"]
[[2],[2,1],[1,1],[2,3],[4,1],[1],[2]]`}</pre>
                <p>
                    <strong>Output</strong>
                </p>
                <pre>[null,null,null,null,null,1,-1]</pre>
                <p>
                    <strong>Expected</strong>
                </p>
                <pre>[null,null,null,null,null,-1,3]</pre>
            </>,
        ],
    ]

    const helpDialogContent = (
        <>
            <p>
                This problem is an example of a task that you might face as a professional software engineer. LRU caches
                are used in many areas, from databases to websites. The fact that ChatGPT provided an incorrect
                implementation demonstrates that you cannot blindly trust it to generate code for you, no matter how
                thorough your prompt is.
            </p>
            <p>
                Without this test, you might not have noticed that ChatGPT's code was flawed. In the real world, if you
                put out flawed code for any reason, it will not only damage your reputation, but also frustrate your
                customers. For this reason, you must always review any code generated by AI assistants, even if it
                appears fine at first glance.
            </p>
            <Image
                src="/images/01.png"
                width={742}
                height={367}
                alt="Charts displaying the performance of GitHub Copilot at solving programming problems compared to students"
            />
            <p>
                For proof,{' '}
                <a href="https://doi.org/10.1016/j.jss.2023.111734" target="_blank">
                    this study
                </a>{' '}
                from the Journal of Systems and Software found that GitHub Copilot only achieved a{' '}
                <strong>39.44%</strong> correctness rate when generating code for fundamental algorithmic problems. The
                ability to correctly handle such problems is crucial for any software engineer to handle more complex
                problems. Although Copilot, ChatGPT, and other AI tools are very impressive, they are not yet ready to
                be relied upon completely.
            </p>
        </>
    )

    const completeDialogContent = (
        <>
            <p>Good job, you fixed the issue!</p>
            <p>
                ChatGPT and other AI programming tools can definitely help you write code faster. Their outputs are
                usually good starting points for whatever problem you face. However, they are not perfect.
            </p>
            <p>
                <strong>Lesson learned:</strong> it's crucial to manually review the code they generate to ensure it's
                correct.
            </p>
        </>
    )

    return (
        <Task
            options={{
                steps: [
                    {
                        type: STEP_TYPES.PROMPT,
                        question: description,
                        answer: response,
                        text: 'Send Description',
                    },
                    { type: STEP_TYPES.PASTE, value: chatGPTCode },
                    { type: STEP_TYPES.TEST, tests: tests, next: 'Help' },
                    { type: STEP_TYPES.HELP },
                    { type: STEP_TYPES.FIX, value: correctCode },
                    { type: STEP_TYPES.TEST, tests: Array(5).fill([true]) },
                ],
                title: 'Algorithm Implementation',
                description: description,
                pasteButtonText: 'Paste Code',
                initialCode: initialCode,
                language: 'python',
                helpDialogContent: helpDialogContent,
                completeDialogContent: completeDialogContent,
            }}
        />
    )
}
