import {AxiosInstance, default as axios} from 'axios';
import {PartialUser, User} from "../models/User.ts";

export class UserService {
    readonly api: AxiosInstance = axios.create({
        baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    async createUser(username: string, email: string): Promise<any> {
        try {
            const response = await this.api.post(`/user`, {
                name: username,
                email: email,
                watch_list: []
            });
            if (response.status != 200) {
                return null;
            } else {
                return response.data;
            }
        } catch (error) {
            return null;
        }
    }

    async getUsers(): Promise<User[]> {
        try {
            const response = await this.api.get(`/users`, {
                params: {
                    cursor: 1,
                    pageSize: 100
                }
            });
            if (response.status != 200) {
                return [];
            } else {
                return response.data;
            }
        } catch (error) {
            return [];
        }
    }

    async getSelectUsers(): Promise<PartialUser[]> {
        try {
            const response = await this.api.get(`/users`, {
                params: {
                    cursor: 1,
                    pageSize: 100
                }
            });
            if (response.status != 200) {
                return [];
            } else {
                const userList: User[] = response.data;
                const formattedList: PartialUser[] = [];
                for (const user of userList) {
                    formattedList.push({
                        label: user.name,
                        value: user.id
                    });
                }
                return formattedList;
            }
        } catch (error) {
            return [];
        }
    }

    async getUser(id: number): Promise<any> {
        try {
            const response = await this.api.get(`/user/${id}`);
            if (response.status != 200) {
                return null;
            } else {
                return response.data;
            }
        } catch (error) {
            return null;
        }
    }


    // async deleteUser(id: number): Promise<User> {
    //     const user: User = await this.getUser(id);
    //
    //     if (user == null) {
    //         throw new BadRequest();
    //     }
    //
    //     return this.prisma.user.delete({
    //         where: {
    //             id: Number(id),
    //         },
    //     });
    // }

    async updateUserWatchList(id: number, stockTicker: string, updateType: string): Promise<any> {
        try {

            const response = await this.api.put(`/user/update_watch_list/${id}`, {
                ticker: stockTicker,
                update_type: updateType
            });
            if (response.status != 200) {
                return null;
            } else {
                return response.data;
            }
        } catch (error) {
            return null;
        }
    }

    // getPaginationModel(body: any): PaginationModel {
    //     if (body == null || body.pageSize == null || body.startingCursor == null) {
    //         return {
    //             startingCursor: 1,
    //             pageSize: 10
    //         }
    //     } else {
    //         return {
    //             startingCursor: body.cursor,
    //             pageSize: body.pageSize
    //         }
    //     }
    // }



}