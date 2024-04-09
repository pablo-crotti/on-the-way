import StatElement from "./statElement";

export default function Stats() {
    return (
        <div className="flex flex-col pt-4 gap-8 items-center h-5/6">
            <h1 className="text-center text-xl font-bold bg-gray p-4 rounded-2xl">Septembre 2023</h1>
            <StatElement icon="timer" value="74:03" description="Total d'heures du mois" />
            <StatElement icon="trending_up" value="18:31" description="Diff. avec le mois précédent" />
            <StatElement icon="account_balance" value="CHF 1'971.71" description="Salaire du mois" />
        </div>
    );
}