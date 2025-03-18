"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/app/ui/connections/connections.module.css";
import clsx from "clsx";

const ButtonGrid = () => {
    // The content of each box (4 sets of 4)
    // const sets = [
    //     ["a", "b", "c", "d"],
    //     ["e", "f", "g", "h"],
    //     ["i", "j", "k", "l"],
    //     ["m", "n", "o", "p"]
    // ];
    const sets = [
        ["CHOCOLATE", "DONUT", "LEMONADE", "PIE"],
        ["CUTE", "FUN", "KIND", "BEAUTIFUL"],
        ["CHICAGO", "NORTH", "PSALM", "SAINT"],
        ["ANTELOP", "GRAND", "KINGS", "ZION"]
    ];

    const categories = [
        "THINGS I WISH I COULD EAT",
        "WORDS TO DESCRIBE ISABEL",
        "KARDASHIAN KIDS",
        "_____ CANYON"
    ]


    function seededShuffle(array: number[], seed: number): number[] {
        // Simple seeded PRNG (Mulberry32)
        function mulberry32(a: number) {
            return function () {
                let t = (a += 0x6D2B79F5);
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        }

        const random = mulberry32(seed);
        const shuffled = [...array];

        // Fisher-Yates Shuffle using the seeded PRNG
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
        }

        return shuffled;
    }

    function stringToSeed(str: string): number {
        // Simple hash function to convert the string into a numeric seed
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        return Math.abs(hash);
    }




    //state
    const [activeBoxes, setActiveBoxes] = useState<number[]>([]); // Track active boxes
    const [completedSets, setCompletedSets] = useState<number[]>([0, 0, 0, 0]); // Track completed sets
    const [order, setOrder] = useState<number[]>(() => {
        // Generate a shuffled order for all boxes (1-16)
        const allBoxes = [...Array(16)].map((_, i) => i + 1); // [1, 2, ..., 16]
        const seed = stringToSeed(categories[0]); // Can use the first set's name as a seed for consistent shuffling
        return seededShuffle(allBoxes, seed); // Shuffle the boxes
    });
    const [toggle, setToggle] = useState<boolean>(false)
    const hasShuffled = useRef(false);  // Track if shuffle has already happened

    const shuffleBoxes = useCallback(() => {
        const activeOrder = order.filter((boxNumber) => boxNumber > 0); //gets all boxs which havent been completed(marked with a -1)
        const completedOrder = order.filter((boxNumber) => boxNumber <= 0);
        const shuffled = [...activeOrder];

        //Fisher-yates shuffle or Knuth shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }

        // Now update the order by placing the completed boxes back in their original positions
        const updatedOrder = [...completedOrder, ...shuffled];
        setOrder(updatedOrder); // Update the order state with shuffled boxes
    }, [order])

    useEffect(() => {
        if (hasShuffled.current) {
            return;  // Do nothing if shuffle has already been performed
        }

        if (toggle) {
            console.log("shuffling")
            shuffleBoxes();  // Shuffle the boxes when `toggle` changes
            setToggle(!toggle)
        }
    }, [toggle, shuffleBoxes]);

    const toggleBox = (boxNumber: number) => {
        setActiveBoxes((prev) => {
            if (prev.includes(boxNumber)) {
                return prev.filter((x) => x !== boxNumber)
            } else if (prev.length >= 4) {
                // max of 4 selected reached
                return prev
            }
            return [...prev, boxNumber]
        })
    }

    const handleSubmit = () => {
        const selectedSet = activeBoxes
            .map((boxNumber) => {
                const setIndex = Math.floor((boxNumber - 1) / 4);
                return sets[setIndex][(boxNumber - 1) % 4];
            })
            .sort();

        const isMatch = sets.some((set) => {
            return (
                set
                    .map((boxContent) => boxContent)
                    .sort()
                    .join(",") === selectedSet.join(",")
            );
        });
        if (isMatch) {
            // Mark the set as completed by updating the completedSets array
            const setIndex = Math.floor((activeBoxes[0] - 1) / 4); // Get the set index based on the first selected box


            const countCompletedSets = completedSets.filter((set) => set != 0).length
            const updatedCompletedSets = [...completedSets];
            updatedCompletedSets[setIndex] = countCompletedSets + 1;
            setCompletedSets(updatedCompletedSets);

            // Remove the completed boxes from the order and add a "complete" box for that set
            const updatedOrder = order.filter((boxNumber) => !activeBoxes.includes(boxNumber));

            // Add the "complete" box at the correct place in the array (in order)
            updatedOrder.splice(countCompletedSets, 0, setIndex * -1); // Insert complete at the correct position

            setOrder(updatedOrder); // Update the order
            setActiveBoxes([]); // Clear active selection
            setToggle(!toggle) //cause a shuffle when toggle state is updated
        } else if (hasThreeMatches(selectedSet)) {
            alert("One away")
        } else {
            alert("The selected boxes do not match any set.");
        }

    }

    const deselect = () => {
        setActiveBoxes([]); // Clear active selection
    };

    function hasThreeMatches(newSet: string[]) {
        return sets.some(existingSet => {
            // Count how many words in newSet match the existingSet
            const matchCount = newSet.filter(word => existingSet.includes(word)).length;
            return matchCount >= 3; // At least 3 words must match
        });
    }

    return (
        <div>
            <div className={styles.container}>
                {/* Render the boxes */}
                {order.map((boxNumber) => {
                    // Check if it's a "complete" box in the order array
                    const isActive = activeBoxes.includes(boxNumber);
                    const isCategory = boxNumber <= 0
                    return (
                        <button
                            key={boxNumber}
                            className={clsx(
                                isActive && styles.active,
                                isCategory ? styles.completeRow : styles.box,
                                boxNumber === 0 && styles.yellow,
                                boxNumber === -1 && styles.green,
                                boxNumber === -2 && styles.blue,
                                boxNumber === -3 && styles.purple
                            )}
                            onClick={() => {
                                if (!isCategory) {  // Only call toggleBox if isCategory is false
                                    toggleBox(boxNumber);
                                }
                            }}
                        >
                            {isCategory ? <section><h1>{categories[-boxNumber]}</h1> {sets[-boxNumber].join(" ")}</section> : sets[Math.floor((boxNumber - 1) / 4)][(boxNumber - 1) % 4]}
                        </button>
                    );
                })}
            </div>
            <div className={styles.submitContainer}>
                <button onClick={deselect} className={styles.submitButton}>
                    Deselect All
                </button>
                <button onClick={shuffleBoxes} className={styles.submitButton}>
                    Shuffle
                </button>
                <button
                    onClick={handleSubmit}
                    className={styles.submitButton}
                    disabled={activeBoxes.length !== 4}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default ButtonGrid;