"use client";

import { Flex, Separator } from "@radix-ui/themes";
import { ToDoColumn } from "@/components/ToDoColumn";
import { ToDoItem as ToDoListType } from "@/types/todo";


export const mockTodos: ToDoListType[] = [
    {
        id: 1,
        title: "Zbudować główny magazyn",
        description: "Centralny magazyn na drewno, kamień i rudy przy portalu",
        createdAt: "2025-12-01T10:00:00Z",
        creatorId: 1,
        status: "in-progress",
        tag: "important",
        comments: [
            {
                id: 1,
                content: "Proponuję budowę z core wood + stone floor",
                createdAt: "2025-12-01T11:00:00Z",
                authorId: 2,
            },
            {
                id: 2,
                content: "Uwaga na stabilność, potrzebne filary",
                createdAt: "2025-12-01T12:30:00Z",
                authorId: 3,
            },
        ],
    },
    {
        id: 2,
        title: "Zebrać drewno na budowę",
        description: "Minimum 10 stacków zwykłego drewna",
        createdAt: "2025-12-01T09:30:00Z",
        creatorId: 2,
        status: "todo",
        tag: "normal",
        comments: [
            {
                id: 3,
                content: "Ja ogarnę Black Forest",
                createdAt: "2025-12-01T09:45:00Z",
                authorId: 2,
            },
            {
                id: 4,
                content: "Zostawcie pnie, użyję do core wood",
                createdAt: "2025-12-01T10:10:00Z",
                authorId: 1,
            },
        ],
    },
    {
        id: 3,
        title: "Farma marchwi",
        description: "Założyć farmę przy bazie startowej",
        createdAt: "2025-12-02T08:00:00Z",
        creatorId: 3,
        status: "done",
        tag: "normal",
        comments: [
            {
                id: 5,
                content: "Nasiona już posadzone",
                createdAt: "2025-12-02T09:00:00Z",
                authorId: 3,
            },
            {
                id: 6,
                content: "Zrobiłem ogrodzenie przed dzikami",
                createdAt: "2025-12-02T10:15:00Z",
                authorId: 1,
            },
        ],
    },
    {
        id: 4,
        title: "Ubić Eikthyra",
        description: "Pierwszy boss – potrzebne poroża",
        createdAt: "2025-12-02T14:00:00Z",
        creatorId: 1,
        status: "done",
        tag: "important",
        comments: [
            {
                id: 7,
                content: "Każdy niech weźmie tarczę",
                createdAt: "2025-12-02T14:10:00Z",
                authorId: 1,
            },
            {
                id: 8,
                content: "Boss pokonany bez strat 💪",
                createdAt: "2025-12-02T15:00:00Z",
                authorId: 2,
            },
        ],
    },
    {
        id: 5,
        title: "Postawić hutę i piec",
        description: "Przetapianie miedzi i cyny",
        createdAt: "2025-12-03T09:00:00Z",
        creatorId: 2,
        status: "in-progress",
        tag: "important",
        comments: [
            {
                id: 9,
                content: "Brakuje jeszcze surtling cores",
                createdAt: "2025-12-03T09:30:00Z",
                authorId: 2,
            },
        ],
    },
    {
        id: 6,
        title: "Kopalnia miedzi",
        description: "Wyczyścić złoże w Black Forest",
        createdAt: "2025-12-03T13:00:00Z",
        creatorId: 3,
        status: "todo",
        tag: "normal",
        comments: [
            {
                id: 10,
                content: "Weźcie kilofy z poroży",
                createdAt: "2025-12-03T13:10:00Z",
                authorId: 1,
            },
            {
                id: 11,
                content: "Uwaga na trolle w okolicy",
                createdAt: "2025-12-03T13:25:00Z",
                authorId: 3,
            },
        ],
    },
    {
        id: 7,
        title: "Portal do Black Forest",
        description: "Szybki dostęp do kopalni",
        createdAt: "2025-12-04T08:30:00Z",
        creatorId: 1,
        status: "todo",
        tag: "important",
        comments: [],
    },
    {
        id: 8,
        title: "Ulepszyć warsztat",
        description: "Dodać chopping block i tanning rack",
        createdAt: "2025-12-04T11:00:00Z",
        creatorId: 2,
        status: "in-progress",
        tag: "normal",
        comments: [
            {
                id: 12,
                content: "Skóry już w skrzyni",
                createdAt: "2025-12-04T11:30:00Z",
                authorId: 2,
            },
        ],
    },
    {
        id: 9,
        title: "Zorganizować skrzynie",
        description: "Podział: jedzenie, surowce, gear",
        createdAt: "2025-12-05T09:00:00Z",
        creatorId: 3,
        status: "todo",
        tag: "backlog",
        comments: [],
    },
    {
        id: 10,
        title: "Przygotowanie na The Elder",
        description: "Jedzenie, bronie, portal awaryjny",
        createdAt: "2025-12-05T15:00:00Z",
        creatorId: 1,
        status: "todo",
        tag: "important",
        comments: [
            {
                id: 13,
                content: "Potrzebne fire arrows",
                createdAt: "2025-12-05T15:30:00Z",
                authorId: 1,
            },
            {
                id: 14,
                content: "Zrobię honey + cooked meat",
                createdAt: "2025-12-05T16:00:00Z",
                authorId: 3,
            },
            {
                id: 15,
                content: "Zrobię honey + cooked meat",
                createdAt: "2025-12-05T16:00:00Z",
                authorId: 3,
            },
            {
                id: 16,
                content: "Zrobię honey + cooked meat",
                createdAt: "2025-12-05T16:00:00Z",
                authorId: 3,
            },
            {
                id: 17,
                content: "Zrobię honey + cooked meat",
                createdAt: "2025-12-05T16:00:00Z",
                authorId: 3,
            },
            {
                id: 18,
                content: "Zrobię honey + cooked meat",
                createdAt: "2025-12-05T16:00:00Z",
                authorId: 3,
            },
        ],
    },
];



export default function ToDoList() {

    const defaultGap: string = "4";

    return (
        <Flex direction={{initial: "column", sm: "row"}} gap={defaultGap} justify={"between"} className="h-[70vh] pt-4">
            
            <ToDoColumn
                title="To Do"
                tasks={mockTodos.filter(t => t.status === "todo")}
            />

            <Separator orientation="vertical" size={"4"} />

            <ToDoColumn
                title="In progress"
                tasks={mockTodos.filter(t => t.status === "in-progress")}
            />

            <Separator orientation="vertical" size={"4"} />

            <ToDoColumn
                title="Done"
                tasks={mockTodos.filter(t => t.status === "done")}
                showTag={false}
            />
        </Flex>
    )
}   