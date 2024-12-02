import React, {useEffect, useMemo} from "react";
import {PartialUser, User} from "../models/User.ts";
import {UserService} from "../api/UserService.ts";
import StockTickerRow from "./StockTickerRow.tsx";
import { useForm } from "react-hook-form"

export interface StockTickersProps {
    user: User;
    userService: UserService;
}



export default function StockTickers(props: StockTickersProps) {
    const [watchList, setWatchList] = React.useState<string[]>([]);
    const [symbol, setSymbol] = React.useState<string>("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const retrievedUser: User = await props.userService.getUser(props.user.id);
                if (retrievedUser && retrievedUser.watch_list) {
                    setWatchList(retrievedUser.watch_list);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [props.user, props.userService]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()
    const onSubmit = handleSubmit(async (data) => updateWatchlist())

    async function updateWatchlist() {
        try {
            if (watchList.includes(symbol)) {
                alert(`Symbol (${symbol}) is already in the watchlist.`)
                return;
            }
            const updatedUser: User = await props.userService.updateUserWatchList(props.user.id, symbol, "add");
            if (updatedUser == null || !updatedUser.watch_list) {
                alert(`Unable to add the stock symbol (${symbol}) to the watchlist. Try again.`)
            } else {
                setWatchList(updatedUser.watch_list);
            }
        } catch (err: any) {
            if (err instanceof Error) {
                alert(`Unable to add the stock symbol (${symbol}) to the watchlist, due to: ${err.message}. Try Again.`)
            }
            else {
                alert('`Unable to add the stock symbol (${symbol}) to the watchlist. Try again.')
            }
        }
    }

    return (
        <div className="flex">
            <div>
                <form className="border-dotted border-indigo-600" onSubmit={onSubmit}
                      id="create-user-form">
                    <label htmlFor="symbol">Enter Stock Ticker Symbol: </label>
                    <input minLength={1} id="symbol" placeholder="foo"
                           onChange={(e) => setSymbol(e.target.value)}/>
                    <button type="submit" name="button" value="submit">Add to WatchList</button>
                </form>
            </div>
            <div className="ml-4">
                <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Stock Ticker</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {watchList.map((x, i) =>
                        <StockTickerRow stockTicker={x}/>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}