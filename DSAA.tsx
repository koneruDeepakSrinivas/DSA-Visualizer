"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, ArrowDown, Moon, Sun } from 'lucide-react'

type DataStructure = 'array' | 'linkedList' | 'stack' | 'queue' | 'binarySearchTree'
type Algorithm = 'bubbleSort' | 'quickSort' | 'mergeSort' | 'binarySearch' | 'depthFirstSearch'

const generateRandomArray = (length: number) => Array.from({ length }, () => Math.floor(Math.random() * 100) + 1)

interface Node {
  value: number
  next?: Node
  left?: Node
  right?: Node
}

class LinkedList {
  head: Node | null = null

  constructor(arr: number[]) {
    let current = null
    for (const value of arr) {
      if (!this.head) {
        this.head = { value }
        current = this.head
      } else if (current) {
        current.next = { value }
        current = current.next
      }
    }
  }

  toArray(): number[] {
    const result = []
    let current = this.head
    while (current) {
      result.push(current.value)
      current = current.next
    }
    return result
  }
}

class BinarySearchTree {
  root: Node | null = null

  constructor(arr: number[]) {
    for (const value of arr) {
      this.insert(value)
    }
  }

  insert(value: number) {
    const newNode = { value }
    if (!this.root) {
      this.root = newNode
      return
    }

    let current = this.root
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode
          break
        }
        current = current.left
      } else {
        if (!current.right) {
          current.right = newNode
          break
        }
        current = current.right
      }
    }
  }

  toArray(): [number, number, number][] {
    const result: [number, number, number][] = []
    const traverse = (node: Node | null, x: number, y: number) => {
      if (!node) return
      result.push([node.value, x, y])
      traverse(node.left, x - 1, y + 1)
      traverse(node.right, x + 1, y + 1)
    }
    traverse(this.root, 0, 0)
    return result
  }
}

export default function Component() {
  const [dataStructure, setDataStructure] = useState<DataStructure>('array')
  const [algorithm, setAlgorithm] = useState<Algorithm>('bubbleSort')
  const [array, setArray] = useState<number[]>(generateRandomArray(10))
  const [linkedList, setLinkedList] = useState<LinkedList>(new LinkedList(array))
  const [stack, setStack] = useState<number[]>([])
  const [queue, setQueue] = useState<number[]>([])
  const [bst, setBST] = useState<BinarySearchTree>(new BinarySearchTree(array))
  const [visualArray, setVisualArray] = useState<number[]>(array)
  const [sorting, setSorting] = useState(false)
  const [searching, setSearching] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [searchValue, setSearchValue] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [darkMode, setDarkMode] = useState(false)
  const [activeDataStructure, setActiveDataStructure] = useState<DataStructure>('array')
  const [activeAlgorithm, setActiveAlgorithm] = useState<Algorithm>('bubbleSort')

  useEffect(() => {
    resetDataStructure()
  }, [activeDataStructure])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const resetDataStructure = () => {
    const newArray = generateRandomArray(10)
    setArray(newArray)
    setVisualArray(newArray)
    setLinkedList(new LinkedList(newArray))
    setStack([])
    setQueue([])
    setBST(new BinarySearchTree(newArray))
    setSearchValue(null)
    setCurrentStep('')
    setDataStructure(activeDataStructure)
  }

  const sleep = () => new Promise(resolve => setTimeout(resolve, 1000 - speed * 4))

  const bubbleSort = async () => {
    setSorting(true)
    const arr = [...visualArray]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentStep(`Comparing ${arr[j]} and ${arr[j + 1]}`)
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          setCurrentStep(`Swapping ${arr[j]} and ${arr[j + 1]}`)
          setVisualArray([...arr])
          await sleep()
        }
      }
    }

    setCurrentStep('Sorting completed')
    setSorting(false)
  }

  const quickSort = async (arr: number[] = [...visualArray], low = 0, high = visualArray.length - 1) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high)
      await quickSort(arr, low, pivotIndex - 1)
      await quickSort(arr, pivotIndex + 1, high)
    }
    return arr
  }

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high]
    setCurrentStep(`Pivot: ${pivot}`)
    let i = low - 1

    for (let j = low; j < high; j++) {
      setCurrentStep(`Comparing ${arr[j]} with pivot ${pivot}`)
      if (arr[j] < pivot) {
        i++
        [arr[i], arr[j]] = [arr[j], arr[i]]
        setCurrentStep(`Swapping ${arr[i]} and ${arr[j]}`)
        setVisualArray([...arr])
        await sleep()
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    setCurrentStep(`Swapping ${arr[i + 1]} and ${arr[high]}`)
    setVisualArray([...arr])
    await sleep()

    return i + 1
  }

  const mergeSort = async (arr: number[] = [...visualArray], start = 0, end = visualArray.length - 1) => {
    if (start < end) {
      const mid = Math.floor((start + end) / 2)
      setCurrentStep(`Dividing array at index ${mid}`)
      await mergeSort(arr, start, mid)
      await mergeSort(arr, mid + 1, end)
      await merge(arr, start, mid, end)
    }
    return arr
  }

  const merge = async (arr: number[], start: number, mid: number, end: number) => {
    const leftArr = arr.slice(start, mid + 1)
    const rightArr = arr.slice(mid + 1, end + 1)
    let i = 0, j = 0, k = start

    while (i < leftArr.length && j < rightArr.length) {
      setCurrentStep(`Comparing ${leftArr[i]} and ${rightArr[j]}`)
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }
      setCurrentStep(`Merging: placed ${arr[k]} at index ${k}`)
      setVisualArray([...arr])
      await sleep()
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      setCurrentStep(`Merging: placed ${arr[k]} at index ${k}`)
      setVisualArray([...arr])
      await sleep()
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      setCurrentStep(`Merging: placed ${arr[k]} at index ${k}`)
      setVisualArray([...arr])
      await sleep()
      j++
      k++
    }
  }

  const binarySearch = async (target: number) => {
    setSearching(true)
    const sortedArr = [...visualArray].sort((a, b) => a - b)
    setVisualArray(sortedArr)
    await sleep()

    let left = 0
    let right = sortedArr.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      setCurrentStep(`Searching at index ${mid}`)
      setSearchValue(sortedArr[mid])
      await sleep()

      if (sortedArr[mid] === target) {
        setCurrentStep(`Found ${target} at index ${mid}`)
        setSearching(false)
        return mid
      }

      if (sortedArr[mid] < target) {
        setCurrentStep(`${target} is greater than ${sortedArr[mid]}, searching right half`)
        left = mid + 1
      } else {
        setCurrentStep(`${target} is less than ${sortedArr[mid]}, searching left half`)
        right = mid - 1
      }
    }

    setCurrentStep(`${target} not found in the array`)
    setSearching(false)
    return -1
  }

  const depthFirstSearch = async (target: number) => {
    setSearching(true)
    const visited = new Set<Node>()
    const stack: Node[] = []

    if (bst.root) {
      stack.push(bst.root)
    }

    while (stack.length > 0) {
      const node = stack.pop()!
      setCurrentStep(`Visiting node ${node.value}`)
      setSearchValue(node.value)
      await sleep()

      if (node.value === target) {
        setCurrentStep(`Found ${target}`)
        setSearching(false)
        return true
      }

      visited.add(node)

      if (node.right && !visited.has(node.right)) {
        stack.push(node.right)
      }
      if (node.left && !visited.has(node.left)) {
        stack.push(node.left)
      }
    }

    setCurrentStep(`${target} not found in the tree`)
    setSearching(false)
    return false
  }

  const runAlgorithm = async () => {
    switch (activeAlgorithm) {
      case 'bubbleSort':
        await bubbleSort()
        break
      case 'quickSort':
        setSorting(true)
        await quickSort()
        setSorting(false)
        break
      case 'mergeSort':
        setSorting(true)
        await mergeSort()
        setSorting(false)
        break
      case 'binarySearch':
        await binarySearch(Math.floor(Math.random() * 100) + 1)
        break
      case 'depthFirstSearch':
        await depthFirstSearch(Math.floor(Math.random() * 100) + 1)
        break
    }
  }

  const renderDataStructure = () => {
    switch (dataStructure) {
      case 'array':
      case 'linkedList':
        return (
          <div className="flex justify-center items-end h-64 space-x-2">
            {visualArray.map((value, index) => (
              <motion.div
                key={index}
                className={`w-8 ${searchValue === value ? 'bg-green-500' : 'bg-blue-500'} rounded-t-lg`}
                style={{ height: `${value}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="text-center text-white text-xs font-semibold">{value}</div>
              </motion.div>
            ))}
          </div>
        )
      case 'stack':
        return (
          <div className="flex flex-col-reverse items-center h-64 space-y-2 space-y-reverse">
            <AnimatePresence>
              {stack.map((value, index) => (
                <motion.div
                  key={index}
                  className="w-32 h-8 bg-purple-500 flex items-center justify-center text-white font-semibold rounded-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      case 'queue':
        return (
          <div className="flex items-center h-64 space-x-2 overflow-x-auto p-4">
            <AnimatePresence>
              {queue.map((value, index) => (
                <motion.div
                  key={index}
                  className="w-8 h-32 bg-pink-500 flex items-center justify-center text-white font-semibold rounded-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      case 'binarySearchTree':
        const treeNodes = bst.toArray()
        const maxDepth = Math.max(...treeNodes.map(([, , y]) => y))
        const nodeSize = 40
        const levelHeight = 60
        return (
          <svg width="100%" height={`${(maxDepth + 1) * levelHeight}px`} className="overflow-visible">
            {treeNodes.map(([value, x, y], index) => (
              <g key={index} transform={`translate(${(x + maxDepth) * nodeSize}, ${y * 
                levelHeight})`}>
                {y > 0 && (
                  <motion.line
                    x1="0"
                    y1="0"
                    x2={x === 0 ? "0" : x > 0 ? "-20" : "20"}
                    y2="-60"
                    stroke={darkMode ? "white" : "black"}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                )}
                <motion.circle
                  r={nodeSize / 2}
                  fill={searchValue === value ? '#10B981' : '#3B82F6'}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
                />
                <motion.text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  {value}
                </motion.text>
              </g>
            ))}
          </svg>
        )
    }
  }

  return (
    <Card className={`w-full max-w-4xl transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Data Structures and Algorithms Visualizer</CardTitle>
            <CardDescription className={`${darkMode ? 'text-black-300' : 'text-black-500'}`}>
              Visualize and interact with various data structures and algorithms
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={() => setActiveDataStructure('array')} variant={activeDataStructure === 'array' ? 'default' : 'outline'}>Array</Button>
          <Button onClick={() => setActiveDataStructure('linkedList')} variant={activeDataStructure === 'linkedList' ? 'default' : 'outline'}>Linked List</Button>
          <Button onClick={() => setActiveDataStructure('stack')} variant={activeDataStructure === 'stack' ? 'default' : 'outline'}>Stack</Button>
          <Button onClick={() => setActiveDataStructure('queue')} variant={activeDataStructure === 'queue' ? 'default' : 'outline'}>Queue</Button>
          <Button onClick={() => setActiveDataStructure('binarySearchTree')} variant={activeDataStructure === 'binarySearchTree' ? 'default' : 'outline'}>Binary Search Tree</Button>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={() => setActiveAlgorithm('bubbleSort')} variant={activeAlgorithm === 'bubbleSort' ? 'default' : 'outline'}>Bubble Sort</Button>
          <Button onClick={() => setActiveAlgorithm('quickSort')} variant={activeAlgorithm === 'quickSort' ? 'default' : 'outline'}>Quick Sort</Button>
          <Button onClick={() => setActiveAlgorithm('mergeSort')} variant={activeAlgorithm === 'mergeSort' ? 'default' : 'outline'}>Merge Sort</Button>
          <Button onClick={() => setActiveAlgorithm('binarySearch')} variant={activeAlgorithm === 'binarySearch' ? 'default' : 'outline'}>Binary Search</Button>
          <Button onClick={() => setActiveAlgorithm('depthFirstSearch')} variant={activeAlgorithm === 'depthFirstSearch' ? 'default' : 'outline'}>Depth-First Search</Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={resetDataStructure} disabled={sorting || searching}>Reset</Button>
          <Button onClick={runAlgorithm} disabled={sorting || searching}>Run Algorithm</Button>
          {(dataStructure === 'stack' || dataStructure === 'queue') && (
            <>
              <Button onClick={() => {
                const newValue = Math.floor(Math.random() * 100) + 1
                if (dataStructure === 'stack') {
                  setStack([...stack, newValue])
                } else {
                  setQueue([...queue, newValue])
                }
              }} disabled={sorting || searching}>
                {dataStructure === 'stack' ? 'Push' : 'Enqueue'}
              </Button>
              <Button onClick={() => {
                if (dataStructure === 'stack') {
                  setStack(stack.slice(0, -1))
                } else {
                  setQueue(queue.slice(1))
                }
              }} disabled={sorting || searching || (dataStructure === 'stack' ? stack.length === 0 : queue.length === 0)}>
                {dataStructure === 'stack' ? 'Pop' : 'Dequeue'}
              </Button>
            </>
          )}
        </div>
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Animation Speed: {speed < 50 ? 'Slow' : speed < 100 ? 'Medium' : 'Fast'}
          </label>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={10}
            max={200}
            step={10}
            className="w-full"
          />
        </div>
        <div className={`mb-6 h-8 text-center font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} aria-live="polite">
          {currentStep}
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {renderDataStructure()}
        </div>
      </CardContent>
    </Card>
  )
}
