"use client";
import { useState } from "react";
import styles from "@/app/ui/connections/connections.module.css";

const ButtonGrid = () => {
    // The content of each box (4 sets of 4)
    const sets = [
        ["Set 1, Box 1", "Set 1, Box 2", "Set 1, Box 3", "Set 1, Box 4"],
        ["Set 2, Box 1", "Set 2, Box 2", "Set 2, Box 3", "Set 2, Box 4"],
        ["Set 3, Box 1", "Set 3, Box 2", "Set 3, Box 3", "Set 3, Box 4"],
        ["Set 4, Box 1", "Set 4, Box 2", "Set 4, Box 3", "Set 4, Box 4"]
    ];

    const [activeBoxes, setActiveBoxes] = useState<number[]>([]); // Track active boxes
    const [order, setOrder] = useState<number[]>([...Array(16)].map((_, i) => i + 1)); // Box order
    const [completedSets, setCompletedSets] = useState<boolean[]>([false, false, false, false]); // Track completed sets

    const toggleBox = (boxNumber: number) => {
        setActiveBoxes((prev) => {
            if (prev.includes(boxNumber)) {
                return prev.filter((num) => num !== boxNumber);
            } else if (prev.length < 4) {
                return [...prev, boxNumber];
            }
            return prev;
        });
    };

    // Shuffle the order of boxes, but exclude the completed boxes from being shuffled
    const shuffleBoxes = () => {
        // Filter out the completed boxes (we'll shuffle only the non-completed ones)
        const activeOrder = order.filter((boxNumber) => !boxNumber.toString().startsWith("complete-"));

        const shuffled = [...activeOrder];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }

        // Now update the order by placing the completed boxes back in their original positions
        const updatedOrder = [...shuffled];

        // Insert completed boxes in the order they were completed
        completedSets.forEach((completed, index) => {
            if (completed) {
                updatedOrder.splice(index * 4, 0, `complete-${index}`);
            }
        });

        setOrder(updatedOrder); // Update the order state with shuffled boxes
    };

    // Handle submit logic based on the active boxes
    const handleSubmit = () => {
        // Check if the selected boxes match any of the sets
        const selectedSet = activeBoxes
            .map((boxNumber) => {
                const setIndex = Math.floor((boxNumber - 1) / 4);
                return sets[setIndex][(boxNumber - 1) % 4];
            })
            .sort();

        const isMatch = sets.some((set, index) => {
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
            const updatedCompletedSets = [...completedSets];
            updatedCompletedSets[setIndex] = true;
            setCompletedSets(updatedCompletedSets);

            // Remove the completed boxes from the order and add a "complete" box for that set
            const updatedOrder = order.filter((boxNumber) => !activeBoxes.includes(boxNumber));

            // Add the "complete" box at the correct place in the array (in order)
            updatedOrder.splice(setIndex * 4, 0, `complete-${setIndex}`); // Insert complete at the correct position

            setOrder(updatedOrder); // Update the order
            setActiveBoxes([]); // Clear active boxes after completing
        } else {
            alert("The selected boxes do not match any set.");
        }
    };

    const deselect = () => {
        setActiveBoxes([]); // Clear active selection
    };

    return (
        <div>
            <div className={styles.container}>
                {/* Render the boxes */}
                {order.map((boxNumber, index) => {
                    // Check if it's a "complete" box in the order array
                    const completedSetIndex = boxNumber.toString().startsWith("complete-")
                        ? parseInt(boxNumber.toString().split("-")[1])
                        : null;

                    // If it's a "Complete" box, render it
                    if (completedSetIndex !== null && completedSets[completedSetIndex]) {
                        return (
                            <div
                                key={boxNumber}
                                className={`${styles.completeRow} ${styles.completedBox}`}
                            >
                                <span>Complete {completedSetIndex + 1}</span>
                            </div>
                        );
                    }

                    const isActive = activeBoxes.includes(boxNumber);
                    return (
                        <button
                            key={boxNumber}
                            className={`${styles.box} ${isActive ? styles.active : ""}`}
                            onClick={() => toggleBox(boxNumber)}
                        >
                            box{boxNumber}
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
    );
};

export default ButtonGrid;
