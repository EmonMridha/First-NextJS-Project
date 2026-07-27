"use client";

import Link from "next/link";
import { Ghost, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Service", href: "/services" },
    { label: "Contact", href: "/contact" }
];

const userMenuItems = [
    { label: "Profile", icon: User, action: "profile" },
    { label: "Settings", icon: Settings, action: "settings" },
]

export function Navbar() {
    const handleUserMenuAction = (action: string) => {
        console.log(`User menu action: ${action}`);
    }

    return (
        <nav className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href='/' className="shrink-0">
                        <span className="text-2xl font-bold text-primary">
                            NextJs
                        </span>
                    </Link>

                    {/* NavLinks */}

                    <div className="hidden md:flex md:items-center md:gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="ml-auto">
                                <div className="w-9 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium">John Doe</p>
                                    <p className="text-xs text-muted-foreground">abc@gmail.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {userMenuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <DropdownMenuItem
                                        key={item.action}
                                        onClick={() => handleUserMenuAction(item.action)}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        <span>{item.label}</span>
                                    </DropdownMenuItem>
                                );
                            })}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUserMenuAction("logout")}>
                                <LogOut className="w-4 h-4 mr-2" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav >
    )
}