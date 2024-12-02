import {UserService} from "../api/UserService.ts";
import {useCallback, useEffect, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";

export interface StockTickerRowProps {
    stockTicker: string;
}

const socketUrl = 'ws://localhost:3000/ticker';
export default function StockTickerRow(props: StockTickerRowProps) {
    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const { sendMessage, lastMessage, getWebSocket } = useWebSocket(socketUrl, {
        shouldReconnect: (closeEvent) => false,
    });
    const [tickerPrice, setTickerPrice] = useState<number>();
    useEffect(() => {
        if (lastMessage !== null) {
            const item = JSON.parse(lastMessage.data);
            console.log(JSON.stringify(item));
            setTickerPrice(item.price);
        }
    }, [lastMessage]);

    useEffect(() => {
        setSocketUrl('ws://localhost:3000/ticker'); // Create new Socket Connection
        sendMessage(props.stockTicker);
    }, [props.stockTicker]);

    useEffect(() => {
        const ws = getWebSocket();
        if (ws) {
            // cleanup web socket when component unmounts
            return ws.close();
        }
    }, []);

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4">{props.stockTicker}</td>
            <td className="px-6 py-4">{tickerPrice}</td>
        </tr>
    )
}