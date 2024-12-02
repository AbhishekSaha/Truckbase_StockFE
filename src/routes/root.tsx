import React, {useEffect, useMemo} from "react";
import {UserService} from "../api/UserService.ts";
import {PartialUser, User} from "../models/User.ts";
import { useForm } from "react-hook-form"
import Select from 'react-select'
import StockTickers from "../components/StockTickers.tsx";


type FormData = {
    username: string
    email: string
}

export default function Root() {
    const userService = useMemo(() => {
        return new UserService();
    }, [])
    const [formName, setFormName] = React.useState("");
    const [formEmail, setFormEmail] = React.useState("");

    const [currentUser, setCurrentUser] = React.useState<User>();
    const [userList, setUserList] = React.useState<PartialUser[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const retrievedUserList = await userService.getSelectUsers();
                setUserList(retrievedUserList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData().then();
    }, [currentUser]);


    const handleSelection = (selected: any) => {
        if (selected == null || selected.value == null || selected.label == null) {
            return;
        }
        const user: User = {
            name: selected.label,
            id: selected.value
        };
        setCurrentUser(user);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()
    const onSubmit = handleSubmit(async (data) => createUser())


    async function createUser() {
        try {
            const createdUser: User = await userService.createUser(formName, formEmail);
            alert(`Added "${JSON.stringify(createdUser)}"`);
            setCurrentUser(createdUser);
        } catch (err: any) {
           if (err instanceof Error) {
               alert(`User creation failed due to: ${err.message}. Try Again.`)
           }
           else {
               alert('User creation failed. Try again.')
           }
        }
    }

    return (<>
            <div className="top-1.5 m-1 fixed">
                <div className="p-10 flex flex-row">
                    <div className="border-dotted border-indigo-600 border-2">
                        <form className="p-2" onSubmit={onSubmit}
                              id="create-user-form">
                            <label htmlFor="username">Username: </label>
                            <input id="username" placeholder="foo"  {...register("username")}
                                   onChange={(e) => setFormName(e.target.value)}/>
                            <label htmlFor="email">Email: </label>
                            <input id="email" placeholder="foo@example.com" {...register("email")}
                                   onChange={(e) => setFormEmail(e.target.value)}/>
                            <button type="submit" name="button" value="submit">Create User</button>
                        </form>
                    </div>
                    <div className="pl-4 pt-1">
                        <div className="m-auto pl-3 flex flex-row">
                            <label htmlFor="users" className="mr-4">Select a User</label>
                            <Select options={userList} onChange={(choice) => handleSelection(choice)}/>
                        </div>
                    </div>
                </div>

            </div>
            <div className="pl-10">
                {currentUser && <StockTickers user={currentUser} userService={userService}/>}
            </div>
        </>
    );
}



