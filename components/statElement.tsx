import styles from "./statElement.module.css";

export default function StatElement(props: { icon: string, value: string, description: string }) {
    let colors: string[] = [];
    switch (props.icon) {
        case "timer":
            colors = ["yellow-symbol", "text-yellow", styles.yellowCircle];
            break;
        case "trending_up":
            colors = ["green-symbol", "text-green", styles.greenCircle];
            break;
        case "trending_down":
            colors = ["red-symbol", "text-red", styles.redCircle];
            break;
        case "account_balance":
            colors = ["silver-symbol", "text-white", styles.whiteCircle];
            break;
    }
    return (
        <div className={styles.rectangle}>
            <span className={"material-symbols-rounded w-min text-6xl basis-1/6 " + colors[0]}>{props.icon}</span>
            <div className="basis-4/5">
                <p className={"font-semibold text-xl " + colors[1]}>{props.value}</p>
                <p className="text-font-secondary">{props.description}</p>
            </div>
            <div className={styles.circle + " " + colors[2]}></div>
        </div>
    );
}