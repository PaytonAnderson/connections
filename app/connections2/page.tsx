import ButtonGrid from "@/app/ui/connections2/buttongrid"; // Adjust the import path if necessary
import styles from "@/app/ui/connections2/connections.module.css";

export default function Home() {
    return (
        <>
            <div className={styles.label}>Create four groups of four!</div>
            <ButtonGrid />
        </>
    );
}
