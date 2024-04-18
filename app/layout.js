import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './globals.css'
import BootstrapClient from '@/components/BootstrapClient.js'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'The Programmer\'s Guide to Using AI',
    description: 'For LMC 3403',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} d-flex flex-column`}>
                <Navbar />
                <div className="flex-grow-1">{children}</div>
                <BootstrapClient />
            </body>
        </html>
    )
}
