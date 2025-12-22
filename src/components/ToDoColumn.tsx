import { ToDoItem, TaskUpdate, NewTaskInput } from "@/types/todo";
import { Flex, Heading, Text, Card, Dialog, Button, Badge, TextArea, TextField, DataList, Box, Separator, ScrollArea, Select, ContextMenu } from "@radix-ui/themes";
import { Pencil1Icon, CheckIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { useState } from "react";
import { getPlayerName } from "@/utils/playersUtils"
import { useServerStore } from "@/store/serverStore";
import { useUserStore } from "@/store/useUserStore";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { MessageCircle } from "@deemlol/next-icons";
import {
  useDraggable,
  useDroppable
} from "@dnd-kit/core";


interface ToDoColumnProps {
    title: string;
    tasks: ToDoItem[];
    status: ToDoItem["status"];
    showTag?: boolean;
    onUpdateTask: (id: number, update: TaskUpdate) => void;
    onAddComment: (taskId: number, content: string) => void;
    onDeleteComment: (taskId: number, commentId: number) => void;
    onAddTask?: (data: NewTaskInput) => void;
    onDeleteTask: (id: number) => void;
}


function DraggableTask({
  task,
  children,
}: {
  task: { id: number };
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}







export function ToDoColumn({ title, tasks, status, showTag=true, onUpdateTask, onAddComment, onDeleteComment, onAddTask, onDeleteTask }: ToDoColumnProps) {

    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });


    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTitles, setEditedTitles] = useState<Record<number, string>>({});
    const { AllPlayersList } = useServerStore();
    const { currentUser } = useUserStore();
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
        onUpdateTask(taskId, { title: newTitle as ToDoItem["title"] })
        // TODO: wywołanie API / callback do parenta
        setEditingTaskId(null);
    };

    const [newComment, setNewComment] = useState<Record<number, string>>({});

    const tagColorClass = {
        important: "text-red-11",
        normal: "text-blue-11",
        backlog: "text-gray-11",
    };

    const [editedDescriptions, setEditedDescriptions] = useState<Record<number, string>>({});

    const truncateTitle = (title: string, limit: number = 40) => {
        return title.length > limit ? title.substring(0, limit) + "..." : title;
    };



    return (
        <Flex direction={"column"} align={"start"} gap={"2"} className="w-full lg:w-1/3 ml-2">
            <Flex justify={"between"} className="w-full mr-4">
                <Heading size={"4"} mb="4">{title}</Heading>
                {onAddTask && title === "To Do" && (
                    <AddTaskDialog
                        onAdd={onAddTask}
                        disabled={!currentUser}
                    />
                )}
            </Flex>

            <ScrollArea scrollbars="vertical">
            <Flex
                ref={setNodeRef}
                direction="column"
                gap="3"
                className={`
                    p-2 mr-3 rounded-xl transition-all duration-200 h-full
                    ${isOver 
                    ? "bg-slate-500/20 transition-all" 
                    : ""
                    }
                `}
            >


            {tasks.length === 0 && (
                <Text as="p">Brak zadań</Text>
            )}

            {tasks.map(task => (
            <DraggableTask task={task} key={task.id}>
                <Dialog.Root>
                    <ContextMenu.Root>
                        <ContextMenu.Trigger>
                            <Box className="w-full min-w-0 rounded-2xl hover:outline outline-slate-600 transition-all duration-100 cursor-pointer">
                                
                                <Dialog.Trigger>
                                    {/* 2. Card musi mieć w-full i resetować domyślne style przycisku triggera */}
                                    <Card className="w-full min-w-0 overflow-hidden" style={{ textAlign: 'left', display: 'block' }}>
                                        <Flex gap="3" align="center" className="w-full min-w-0">
                                            
                                            {/* 3. Kontener tekstu MUSI mieć min-w-0 oraz flex-1 */}
                                            <Box className="min-w-0 flex-1">
                                                <Text 
                                                    as="div" 
                                                    weight="medium" 
                                                    size="3" 
                                                    className="truncate"
                                                    style={{ width: '100%', display: 'block' }}
                                                    title={task.title}
                                                >
                                                    {truncateTitle(task.title, 25)}
                                                </Text>
                                                <Text as="div" size="1" color="gray" className="truncate">
                                                    {getPlayerName(task.creatorId, AllPlayersList)}, {formatDate(task.createdAt)}
                                                </Text>
                                            </Box>

                                            {/* 4. Prawa strona musi mieć shrink-0, żeby nie zabierać miejsca tekstowi */}
                                            <Flex direction="column" gap="1" align="end" className="shrink-0">
                                                <Badge hidden={!showTag} size="1" color={task.tag === "important" ? "red" : task.tag === "normal" ? "blue" : "gray"}>
                                                    <Text size="1">{task.tag}</Text>
                                                </Badge>
                                                <Badge>
                                                    <Text size="1">{task.comments.length}</Text>
                                                    <MessageCircle size={13} color="#B0B4BA" />
                                                </Badge>
                                            </Flex>

                                        </Flex>
                                    </Card>
                                </Dialog.Trigger>
                            </Box>
                        </ContextMenu.Trigger>

                        <ContextMenu.Content>
                            <ContextMenu.Item
                                color="red"
                                onSelect={() => {
                                    if (confirm("Na pewno usunąć to zadanie?")) {
                                        onDeleteTask(task.id);
                                    }
                                }}
                            >
                            Usuń zadanie
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Root>

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
                                        size="2"
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
                                    onUpdateTask(task.id, { status: value as ToDoItem["status"] })
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
                                    value={editedDescriptions[task.id] ?? task.description}
                                    resize="none" 
                                    className="flex-1 mb-4 h-64 md:h-full font-mono text-sm leading-relaxed"
                                    onChange={(e) =>
                                        setEditedDescriptions(prev => ({
                                        ...prev,
                                        [task.id]: e.target.value,
                                        }))
                                    }
                                    onBlur={() => {
                                        const newValue = editedDescriptions[task.id];
                                        if (newValue !== undefined && newValue !== task.description) {
                                        onUpdateTask(task.id, { description: newValue });
                                        }
                                    }}
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
                                            <DataList.Value>{getPlayerName(task.creatorId, AllPlayersList)}</DataList.Value>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.Label minWidth="80px">Tag</DataList.Label>
                                            <DataList.Value>
                                                <Select.Root
                                                    size={"1"}
                                                    value={task.tag}
                                                    onValueChange={(value) =>
                                                        onUpdateTask(task.id, { tag: value as ToDoItem["tag"] })
                                                    }
                                                >
                                                    <Select.Trigger className={tagColorClass[task.tag]} />
                                                    <Select.Content>
                                                        <Select.Item value="important">Important</Select.Item>
                                                        <Select.Item value="normal">Normal</Select.Item>
                                                        <Select.Item value="backlog">Backlog</Select.Item>
                                                    </Select.Content>
                                                </Select.Root>
                                            </DataList.Value>
                                        </DataList.Item>
                                    </DataList.Root>
                                    <Flex justify={"between"} className="w-full">
                                        <Dialog.Close>
                                            <Button variant="surface" color="gray" size="2">
                                                Zamknij
                                            </Button>
                                        </Dialog.Close>
                                        <Button 
                                            variant="surface" 
                                            color="red" 
                                            onClick={() => {
                                                if (confirm("Na pewno usunąć to zadanie?")) {
                                                    onDeleteTask(task.id);
                                                }
                                            }}
                                        >
                                            Usuń zadanie
                                        </Button>
                                    </Flex>
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
                                                    <ContextMenu.Root key={comment.id}>
                                                        <ContextMenu.Trigger>
                                                        <Flex gap="2" direction="column">
                                                            <Flex justify="between" align="baseline">
                                                                <Text size="1" weight="bold" color="amber">
                                                                    {getPlayerName(comment.authorId, AllPlayersList)}
                                                                </Text>
                                                                <Text size="1" color="gray">
                                                                    {formatDate(comment.createdAt)}, {formatTime(comment.createdAt)}
                                                                </Text>
                                                            </Flex>
                                                            <Text size="2">
                                                                {comment.content}
                                                            </Text>
                                                        </Flex>
                                                        </ContextMenu.Trigger>
                                                        <ContextMenu.Content>
                                                            <ContextMenu.Item
                                                                color="red"
                                                                onSelect={() =>
                                                                    onDeleteComment(task.id, comment.id)
                                                                }
                                                            >
                                                                Usuń komentarz
                                                            </ContextMenu.Item>
                                                        </ContextMenu.Content>
                                                    </ContextMenu.Root>
                                                ))
                                            )}
                                    </Flex>
                                </ScrollArea>

                                <Flex gap={"3"} justify={"between"} align={"center"} className="w-full">
                                    <TextArea
                                        variant="surface"
                                        className="flex-1"
                                        placeholder={
                                            currentUser
                                            ? "Dodaj komentarz..."
                                            : "Wybierz użytkownika, aby dodać komentarz"
                                        }
                                        size="2"
                                        value={newComment[task.id] ?? ""}
                                        onChange={(e) =>
                                            setNewComment(prev => ({
                                            ...prev,
                                            [task.id]: e.target.value,
                                            }))
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            const content = newComment[task.id]?.trim();
                                            if (!content) return;

                                            onAddComment(task.id, content);
                                            setNewComment(prev => ({ ...prev, [task.id]: "" }));
                                            }
                                        }}
                                    />
                                    <Button 
                                        variant="surface" 
                                        disabled={!currentUser}
                                        size="2" 
                                        className="ml-2"
                                        onClick={() => {
                                            const content = newComment[task.id]?.trim();
                                            if (!content) return;

                                            onAddComment(task.id, content);
                                            setNewComment(prev => ({ ...prev, [task.id]: "" }));
                                        }}
                                    >
                                        <PaperPlaneIcon />
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
                </DraggableTask>
                ))}
            </Flex>
            </ScrollArea>
            
        </Flex>
    );
}
