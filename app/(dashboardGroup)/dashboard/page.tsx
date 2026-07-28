import { getMe } from '@/service/getMe'
import React from 'react'

const UserDashboardPage = async() => {

    const user = await getMe()
    console.log(user);
    return (
        <div>UserDashboardPage</div>
    )
}

export default UserDashboardPage