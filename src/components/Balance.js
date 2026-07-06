import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import StatCard from "./ui/StatCard";

function Balance() {

    const { transactions } = useContext(GlobalContext);

    const amounts = transactions.map(item => item.amount);

    const total = amounts.reduce((a,b)=>a+b,0).toFixed(2);

    return (

        <StatCard
            title="Current Balance"
            value={`₹${total}`}
            icon="💰"
        />

    );

}

export default Balance;