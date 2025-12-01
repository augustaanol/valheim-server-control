"use client";

import { Card, Flex, Heading, Text, Button, DropdownMenu, Box } from "@radix-ui/themes";
import Image from "next/image";
import { Pirata_One } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";


const pirataOne = Pirata_One({
        weight: "400",
        subsets: ["latin"],
    });

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Serwer", href: "/server" },
    { name: "Statystyki", href: "/stats" },
    { name: "Komendy", href: "/commands" },
];


export default function Navbar({ titleText }: {titleText: string }) {

    const isMobile =
        typeof window !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const pathname = usePathname();

    return (
        <>
        {!isMobile && (
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
        )}

        {isMobile && (
            <Flex align={"center"} justify={"between"} className="pt-6 pb-6 px-1 md:pb-12 sticky top-0">
                <Flex gap={"3"} align="center">
                    <Image alt="logo" src="/images/valheim_logo_large.webp" width={160} height={100} className="w-28" />
                    <Heading 
                        as="h1" 
                        size={"7"} 
                        style={{ fontFamily: pirataOne.style.fontFamily }}
                        >
                        ADiheim SC
                    </Heading>
                </Flex>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="surface" color="gray" size={"3"} className="p-2">
                            <HamburgerMenuIcon width={"20"} height={"20"} />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content size={"2"} variant="soft">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                            <Box key={link.href} p="1"width={"full"}>
                                <Link href={link.href}>
                                    <DropdownMenu.Item>
                                            <Text 
                                            size={"5"}
                                            align={"right"}
                                            weight={isActive ? "medium" : "regular"}
                                            className={isActive ? "text-white" : "text-gray-400 hover:text-gray-300"}
                                            >
                                                {link.name}
                                            </Text>
                                    </DropdownMenu.Item>
                                </Link>
                            </Box>
                            );
                        })}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Flex>
        )}
        </>
    )
}