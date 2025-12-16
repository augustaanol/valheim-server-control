import { ToDoItem } from "@/types/todo";
import { Flex, Heading, Text, Card, Dialog, Button, Badge, TextArea, DataList, Box } from "@radix-ui/themes";
import { formatDate, formatTime } from "@/utils/formatDateTime";

interface ToDoColumnProps {
    title: string;
    tasks: ToDoItem[];
    showTag?: boolean;
}

export function ToDoColumn({ title, tasks, showTag=true }: ToDoColumnProps) {
    return (
        <Flex direction={"column"} align={"start"} gap={"2"} className="w-full lg:w-1/3 px-3">
            <Heading size={"4"} mb="4">{title}</Heading>

            {tasks.length === 0 && (
                <Text as="p">Brak zadań</Text>
            )}

            {tasks.map(task => (
                <Dialog.Root key={task.id}>
                    <Box className="w-full">
                        <Dialog.Trigger className="w-full">
                            <Card>
                                <Flex justify={"between"}>
                                    <Flex direction={"column"}>
                                        <Text weight={"medium"} size="2">{task.title}</Text>
                                        <Text size={"1"} color="gray">{formatDate(task.createdAt)}</Text>
                                    </Flex>
                                    <Flex direction={"column"}>
                                        <Badge hidden={!showTag} size="1" color={task.tag === "important" ? "red" : task.tag === "normal" ? "blue" : "gray"}>
                                            {task.tag}
                                        </Badge>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Dialog.Trigger>
                    </Box>

                    <Dialog.Content size={"4"}>
                        <Flex direction={"column"} gap={"4"} className="w-full">
                            <Dialog.Title>{task.title}</Dialog.Title>
                            <Flex gap={"4"} justify={"between"}>
                                <Flex direction={"column"} gap={"4"} className="w-1/2">
                                    <TextArea value={task.description} readOnly className="h-50"/>
                                    <DataList.Root>
                                        <DataList.Item>
                                            <DataList.Label>Utworzone</DataList.Label>
                                            <DataList.Value>{formatDate(task.createdAt)}</DataList.Value>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.Label>Autor</DataList.Label>
                                            <DataList.Value>{task.creatorId}</DataList.Value>
                                        </DataList.Item>
                                    </DataList.Root>
                                </Flex>
                                <Flex direction={"column"} className="w-1/2">
                                    <Text size="3" weight="medium" mb="2" align={"right"}>Komentarze</Text>
                                    <Flex direction={"column"} gap={"2"}>
                                        {task.comments.length === 0 && (
                                            <Text as="p">Brak komentarzy</Text>
                                        )}
                                        {task.comments.map(comment => (
                                            <Card key={comment.id} variant="surface">
                                                <Flex direction={"column"} gap={"1"}>
                                                    <Flex justify={"between"} align={"center"}>
                                                        <Text size="2" weight="medium">{comment.authorId}</Text>
                                                        <Text size="1">{formatDate(comment.createdAt)}, {formatTime(comment.createdAt)}</Text>
                                                    </Flex>
                                                    <Text size="1">{comment.content}</Text>
                                                    
                                                </Flex>
                                            </Card>
                                        ))}
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Dialog.Close>
                                <Button variant="surface">Zamknij</Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            ))}
        </Flex>
    );
}
