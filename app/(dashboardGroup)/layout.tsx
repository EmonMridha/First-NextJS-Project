import React, { ReactNode } from 'react'

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            {/* Navbar */}
            {children}
            {/* Footer */}
        </>
    )
}

export default DashboardLayout