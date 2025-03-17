import ButtonGrid from "@/app/ui/connections/buttongrid"; // Adjust the import path if necessary
import styles from "@/app/ui/connections/connections.module.css";

export default function Home() {
    return (
        <>
            <div className={styles.label}>Create four groups of four!</div>
            {/* Use the ButtonGrid component here */}
            <ButtonGrid />
        </>
    );
}
