"use client";

import { Flex, Separator, Card, Text, Box } from "@radix-ui/themes";
import { ToDoColumn } from "@/components/ToDoColumn";
import { ToDoItem as ToDoListType, TaskUpdate as TaskUpdate, NewTaskInput } from "@/types/todo";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { fetchTasks, deleteTask, createTask,updateTask } from "@/app/api/tasks";
import { createComment, deleteComment } from "@/app/api/comments";
import { useTaskEvents } from "@/hooks/useTaskEvents";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { formatDate } from "@/utils/formatDateTime";





export default function ToDoList() {

    const [tasks, setTasks] = useState<ToDoListType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<ToDoListType | null>(null);


    const { currentUser } = useUserStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
            delay: 200,      // ms – przytrzymanie
            tolerance: 5,    // px – mały ruch nie uruchamia draga
            },
        })
        );


    const refreshTasks = async () => {
        const fresh = await fetchTasks();
        setTasks(fresh);
    };

    useTaskEvents(refreshTasks);


    useEffect(() => {
        fetchTasks()
            .then(setTasks)
            .catch((err: unknown) => {
            console.error(err);
            setError("Nie udało się pobrać zadań");
            })
            .finally(() => setLoading(false));
        }, []);


    const onUpdateTask = async (id: number, update: TaskUpdate) => {
        try {
            await updateTask(id, update);   // PATCH
            const fresh = await fetchTasks(); // GET + mapowanie
            setTasks(fresh);
        } catch (e) {
            console.error(e);
        }
    };


    const onAddComment = async (taskId: number, content: string) => {
        if (!currentUser) {
            alert("Wybierz użytkownika");
            return;
        }

        try {
            await createComment(taskId, content, currentUser.steam_id);

            // 🔥 KLUCZOWA LINIJKA
            const freshTasks = await fetchTasks();
            setTasks(freshTasks);
        } catch (err) {
            console.error(err);
            alert("Nie udało się dodać komentarza");
        }
    };




    const onDeleteComment = async (taskId: number, commentId: number) => {
        const prev = tasks;

        setTasks((tasks) =>
            tasks.map((t) =>
            t.id === taskId
                ? {
                    ...t,
                    comments: t.comments.filter((c) => c.id !== commentId),
                }
                : t
            )
        );

        try {
            await deleteComment(commentId);
        } catch {
            setTasks(prev);
            alert("Nie udało się usunąć komentarza");
        }
    };


    const onAddTask = async (data: NewTaskInput) => {
        if (!currentUser) {
            alert("Wybierz użytkownika");
            return;
        }

        try {
            await createTask({
            ...data,
            creatorId: currentUser.steam_id,
            });

            // 🔥 JEDYNE ŹRÓDŁO PRAWDY
            const freshTasks = await fetchTasks();
            setTasks(freshTasks);

        } catch (err) {
            console.error(err);
            alert("Nie udało się dodać zadania");
        }
    };

    const onDeleteTask = async (id: number) => {
        // optimistic update
        const prevTasks = tasks;
        setTasks((prev) => prev.filter((t) => t.id !== id));

        try {
            await deleteTask(id);
        } catch (err) {
            console.error(err);
            // rollback
            setTasks(prevTasks);
            alert("Nie udało się usunąć zadania");
        }
    };

    if (loading) {
        return <p>Ładowanie zadań…</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }



    return (

        <DndContext
            onDragStart={(event) => {
                const task = tasks.find(t => t.id === event.active.id);
                if (task) setActiveTask(task);
            }}
            onDragEnd={async (event) => {
                const { active, over } = event;

                setActiveTask(null);

                if (!over) return;

                const taskId = Number(active.id);
                const newStatus = over.id as ToDoListType["status"];

                const task = tasks.find(t => t.id === taskId);
                if (!task || task.status === newStatus) return;

                try {
                await updateTask(taskId, { status: newStatus });
                const fresh = await fetchTasks();
                setTasks(fresh);
                } catch (e) {
                console.error(e);
                }
            }}
            onDragCancel={() => setActiveTask(null)}
            sensors={sensors}
        >

        <Flex direction={{initial: "column", sm: "row"}} gap={"2"} justify={"between"} className="h-[70vh] pt-4">
            
            
            <ToDoColumn
                title="To Do"
                tasks={tasks.filter(t => t.status === "todo")}
                status="todo"
                onUpdateTask={onUpdateTask}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                onAddTask={onAddTask}
                onDeleteTask={onDeleteTask}
            />

            <Separator orientation="vertical" size={"4"} />

            <ToDoColumn
                title="In progress"
                tasks={tasks.filter(t => t.status === "in-progress")}
                status="in-progress"
                onUpdateTask={onUpdateTask}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                onAddTask={onAddTask}
                onDeleteTask={onDeleteTask}
            />

            <Separator orientation="vertical" size={"4"} />

            <ToDoColumn
                title="Done"
                tasks={tasks.filter(t => t.status === "done")}
                status="done"
                showTag={false}
                onUpdateTask={onUpdateTask}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                onAddTask={onAddTask}
                onDeleteTask={onDeleteTask}
            />
        </Flex>
        <DragOverlay dropAnimation={null}>
            {activeTask ? (
                <Card
                    className="shadow-xl"
                    style={{
                        width: 320,
                        maxWidth: "90vw",
                    }}
                >
                <Flex gap="3" align="center">
                    <Box className="min-w-0 flex-1">
                        <Flex direction={"column"}>
                            <Text weight="medium" size="3" className="truncate">
                                {activeTask.title}
                            </Text>
                            <Text size="1" color="gray">
                                {formatDate(activeTask.createdAt)}
                            </Text>
                        </Flex>
                    </Box>
                </Flex>
                </Card>
            ) : null}
        </DragOverlay>
        </DndContext>
    )
}   