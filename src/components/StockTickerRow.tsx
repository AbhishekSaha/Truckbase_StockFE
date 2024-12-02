import {UserService} from "../api/UserService.ts";
import {useCallback, useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";

export interface StockTickerRowProps {
    stockTicker: string;
}

const socketUrl = 'ws://localhost:3000/ticker';
export default function StockTickerRow(props: StockTickerRowProps) {
    const [socketUrl, setSocketUrl] = useState('ws://localhost:3000/ticker');
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
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
        sendMessage(props.stockTicker);
    }, [props.stockTicker]);


    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4">{props.stockTicker}</td>
            <td className="px-6 py-4">{tickerPrice}</td>
        </tr>
    )
}