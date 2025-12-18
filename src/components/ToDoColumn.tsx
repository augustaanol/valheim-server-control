import { ToDoItem } from "@/types/todo";
import { Flex, Heading, Text, Card, Dialog, Button, Badge, TextArea, TextField, DataList, Box, Separator, ScrollArea, Select } from "@radix-ui/themes";
import { Pencil1Icon, CheckIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { useState } from "react";

interface ToDoColumnProps {
    title: string;
    tasks: ToDoItem[];
    showTag?: boolean;
    onStatusChange: (taskId: number, status: ToDoItem["status"]) => void;
}

export function ToDoColumn({ title, tasks, showTag=true, onStatusChange }: ToDoColumnProps) {

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTitles, setEditedTitles] = useState<Record<number, string>>({});

    // 2️⃣ Helpery
    const startEdit = (task: ToDoItem) => {
        setEditingTaskId(task.id);
        setEditedTitles(prev => ({
            ...prev,
            [task.id]: task.title,
        }));
    };

    const cancelEdit = (taskId: number, originalTitle: string) => {
        setEditedTitles(prev => ({
            ...prev,
            [taskId]: originalTitle,
        }));
        setEditingTaskId(null);
    };

    const saveEdit = (taskId: number) => {
        const newTitle = editedTitles[taskId];
        console.log("SAVE:", taskId, newTitle);
        // TODO: wywołanie API / callback do parenta
        setEditingTaskId(null);
    };

    return (
        <Flex direction={"column"} align={"start"} gap={"2"} className="w-full lg:w-1/3 px-2">
            <Heading size={"4"} mb="4">{title}</Heading>

            {tasks.length === 0 && (
                <Text as="p">Brak zadań</Text>
            )}

            {tasks.map(task => (
                <Dialog.Root key={task.id}>
                    <Box className="w-full rounded-2xl hover:outline outline-slate-600 transition-all duration-100 cursor-pointer">
                        <Dialog.Trigger className="w-full">
                            <Card>
                                <Flex justify={"between"}>
                                    <Flex direction={"column"}>
                                        <Text weight={"medium"} size="2">{task.title}</Text>
                                        <Text size={"1"} color="gray">{formatDate(task.createdAt)}</Text>
                                    </Flex>
                                    <Flex direction={"column"}>
                                        <Badge hidden={!showTag} size="1" color={task.tag === "important" ? "red" : task.tag === "normal" ? "blue" : "gray"}>
                                            <Text size={"1"}>{task.tag}</Text>
                                        </Badge>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Dialog.Trigger>
                    </Box>

                    <Dialog.Content 
                        size="3"
                        maxWidth={{initial: "90vw", sm: "60vw"}}
                        className="h-[65vh] flex flex-col"
                        >
                            
                        <Flex justify="between" align="center" mb="4" className="shrink-0">
                            
                            {editingTaskId !== task.id ? (
                                <Flex align={"start"}>
                                    <Dialog.Title className="m-0 truncate pr-4">
                                        {task.title}
                                    </Dialog.Title>
                                    <Button
                                        variant="ghost"
                                        size="1"
                                        onClick={() => startEdit(task)}
                                    >
                                        <Pencil1Icon />
                                    </Button>
                                </Flex>
                            ) : (
                                <Flex align={"center"} gap="2" className="w-1/2">
                                    <TextField.Root
                                        value={editedTitles[task.id] ?? ""}
                                        autoFocus
                                        className="w-full"
                                        onChange={(e) =>
                                            setEditedTitles(prev => ({
                                                ...prev,
                                                [task.id]: e.target.value,
                                            }))
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") saveEdit(task.id);
                                            if (e.key === "Escape") cancelEdit(task.id, task.title);
                                        }}
                                    />
                                    <Button variant="surface" size="1" onClick={() => saveEdit(task.id)}>
                                        <CheckIcon />
                                    </Button>
                                </Flex>
                            )}

                            <Select.Root
                                value={task.status}
                                onValueChange={(value) =>
                                    onStatusChange(task.id, value as ToDoItem["status"])
                                }
                            >
                                <Select.Trigger />
                                <Select.Content>
                                    <Select.Item value="todo">To Do</Select.Item>
                                    <Select.Item value="in-progress">In progress</Select.Item>
                                    <Select.Item value="done">Done</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            
                        </Flex>

                       
                        <Flex gap="4" direction={{initial: "column", sm: "row"}} className="flex-1 min-h-0 w-full overflow-clip">
                            
                            {/* LEWA KOLUMNA: Opis + Metadane */}
                            <Flex direction="column" className="w-full md:w-1/2 h-full">
                                {/* TextArea zajmuje całą dostępną przestrzeń wypychając metadane na dół */}
                                <TextArea 
                                    variant="surface" 
                                    size="3" 
                                    value={task.description} 
                                    readOnly 
                                    resize="none" 
                                    className="flex-1 mb-4 h-64 md:h-full font-mono text-sm leading-relaxed" 
                                />
                                
                                {/* Metadane przyklejone do dołu */}
                                <div className="flex flex-col items-start shrink-0 gap-5">
                                    <DataList.Root size="1">
                                        <DataList.Item>
                                            <DataList.Label minWidth="80px">Utworzone</DataList.Label>
                                            <DataList.Value>{formatDate(task.createdAt)}</DataList.Value>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.Label minWidth="80px">Autor</DataList.Label>
                                            <DataList.Value>{task.creatorId}</DataList.Value>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.Label minWidth="80px">Tag</DataList.Label>
                                            <DataList.Value>
                                                <Badge size="1" color={task.tag === "important" ? "red" : task.tag === "normal" ? "blue" : "gray"}>
                                                    <Text size={"1"}>{task.tag}</Text>
                                                </Badge>
                                            </DataList.Value>
                                        </DataList.Item>
                                    </DataList.Root>
                                    <Dialog.Close>
                                        <Button variant="surface" color="gray" size="2">
                                            Zamknij
                                        </Button>
                                    </Dialog.Close>
                                </div>
                            </Flex>

                            <Separator orientation={{initial: "horizontal", sm: "vertical"}} size="4" />

                            {/* PRAWA KOLUMNA: Komentarze */}
                            <Flex direction="column" gap={"5"} className="w-full md:w-1/2 h-full">

                                <ScrollArea scrollbars="vertical" className="pr-5">
                                {/* Scrollowalny kontener tylko dla listy komentarzy */}
                                    <Flex direction="column" gap="6" className="flex-1">
                                        
                                            {task.comments.length === 0 ? (
                                                <Flex justify="center" align="center" className="h-full text-gray-400">
                                                    <Text size="2">Brak komentarzy</Text>
                                                </Flex>
                                            ) : (
                                                task.comments.map((comment) => (
                                                    <Flex gap="2" direction="column" key={comment.id}>
                                                        <Flex justify="between" align="baseline">
                                                            <Text size="1" weight="bold" color="indigo">
                                                                {comment.authorId}
                                                            </Text>
                                                            <Text size="1" color="gray">
                                                                {formatDate(comment.createdAt)}, {formatTime(comment.createdAt)}
                                                            </Text>
                                                        </Flex>
                                                        <Text size="2">
                                                            {comment.content}
                                                        </Text>
                                                    </Flex>
                                                ))
                                            )}
                                    </Flex>
                                </ScrollArea>

                                <Flex gap={"3"} justify={"between"} align={"center"} className="w-full">
                                    <TextArea
                                        variant="surface"
                                        className="flex-1"
                                        placeholder="Dodaj komentarz..."
                                        size="2"
                                    />
                                    <Button variant="surface" size="2" className="ml-2">
                                        <PaperPlaneIcon />
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            ))}
        </Flex>
    );
}
