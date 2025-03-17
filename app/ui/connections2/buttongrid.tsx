"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/app/ui/connections/connections.module.css";

const ButtonGrid = () => {
    // The content of each box (4 sets of 4)
    const sets = [
        ["Set 1, Box 1", "Set 1, Box 2", "Set 1, Box 3", "Set 1, Box 4"],
        ["Set 2, Box 1", "Set 2, Box 2", "Set 2, Box 3", "Set 2, Box 4"],
        ["Set 3, Box 1", "Set 3, Box 2", "Set 3, Box 3", "Set 3, Box 4"],
        ["Set 4, Box 1", "Set 4, Box 2", "Set 4, Box 3", "Set 4, Box 4"]
    ];

    //state
    const [activeBoxes, setActiveBoxes] = useState<number[]>([]); // Track active boxes
    const [completedSets, setCompletedSets] = useState<number[]>([0, 0, 0, 0]); // Track completed sets
    const [order, setOrder] = useState<number[]>([...Array(16)].map((_, i) => i + 1)); // Box order
    const [toggle, setToggle] = useState<Boolean>(false)
    const isFirstRender = useRef(true); // Track the first render

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Skip the effect during the first render
            return; // Prevent the effect from running on the first render
        }

        // Your effect logic, will run when `toggle` changes after the first render
        shuffleBoxes();
    }, [toggle]); // Runs when `toggle` changes

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
            console.log(`updatedorder submit ${updatedOrder}`)

            console.log(`order \n${order}`)
            setOrder(updatedOrder); // Update the order
            console.log(`order \n${order}`)
            setActiveBoxes([]); // Clear active selection
            setToggle(!toggle) //cause a shuffle when toggle state is updated
        } else {
            alert("The selected boxes do not match any set.");
        }

    }

    const shuffleBoxes = () => {
        const countCompletedSets = completedSets.filter((set) => set != 0).length
        const activeOrder = order.filter((boxNumber) => boxNumber > 0); //gets all boxs which havent been completed(marked with a -1)
        const completedOrder = order.filter((boxNumber) => boxNumber <= 0);
        const shuffled = [...activeOrder];
        console.log("shuffle start")
        console.log(`completedSets ${completedSets}`)
        console.log(`active order \n${activeOrder}`)
        console.log(`completed order \n${completedOrder}`)
        console.log(`order \n${order}`)

        //Fisher-yates shuffle or Knuth shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }

        // Now update the order by placing the completed boxes back in their original positions
        const updatedOrder = [...completedOrder, ...shuffled];
        setOrder(updatedOrder); // Update the order state with shuffled boxes
        console.log(`updated order\n${updatedOrder}`)
        console.log(`shuffled\n${shuffled}`)
        console.log("shuffle end")
    }

    const deselect = () => {
        setActiveBoxes([]); // Clear active selection
    };

    return (
        <div>
            <div className={styles.container}>
                {/* Render the boxes */}
                {order.map((boxNumber, index) => {
                    // Check if it's a "complete" box in the order array
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
    )
}

export default ButtonGrid;