"use client";

import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { Pirata_One } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";


const pirataOne = Pirata_One({
        weight: "400",
        subsets: ["latin"],
    });

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Serwer", href: "/server" },
    { name: "Statystyki", href: "/stats" }
];


export default function Navbar({ titleText }: {titleText: string }) {

    const pathname = usePathname();

    return (
        <Flex align={"center"} justify={"between"} direction={{initial: "column", md: "row"}} className="pt-8 pb-6 md:pb-12 gap-6 sticky top-0">
            <Flex align={{md: "center"}} gap={"5"}>
                <Image alt="logo" src="/images/valheim_logo_large.webp" width={160} height={100} className="sm:w-14 md:w-40" />
                <Heading 
                    as="h1" 
                    size={{initial: "6",md: "8"}} 
                    style={{ fontFamily: pirataOne.style.fontFamily }}
                    >
                    {titleText}
                </Heading>
            </Flex>
            <Flex align="center">
                <Card>
                    <Flex align={"center"} gap="6" className="px-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                            <Link key={link.href} href={link.href}>
                                <Text
                                    size="4"
                                    weight={isActive ? "medium" : "regular"}
                                    className={isActive ? "text-white" : "text-gray-400 hover:text-gray-300"}
                                    >
                                {link.name}
                                </Text>
                            </Link>
                            );
                        })}
                    </Flex>
                </Card>
            </Flex>
        </Flex>
    )
}